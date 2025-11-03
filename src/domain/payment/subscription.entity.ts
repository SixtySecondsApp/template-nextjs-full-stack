/**
 * Subscription Domain Entity
 * Represents a user's subscription to a community payment tier
 * Pure business logic, no framework dependencies
 *
 * Business Rules:
 * - currentPeriodEnd must be after currentPeriodStart
 * - trialEndsAt must be after currentPeriodStart (if set)
 * - Cannot cancel already cancelled subscription
 * - Cannot modify archived subscriptions
 * - V1: 7-day trial period available for paid tiers
 * - Stripe IDs are optional (for free tiers)
 */

import {
  SubscriptionStatus,
  BillingInterval,
} from './subscription-status.enum';

export class Subscription {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly communityId: string,
    private readonly paymentTierId: string,
    private stripeSubscriptionId: string | null,
    private stripeCustomerId: string | null,
    private status: SubscriptionStatus,
    private readonly interval: BillingInterval,
    private currentPeriodStart: Date,
    private currentPeriodEnd: Date,
    private cancelAtPeriodEnd: boolean,
    private trialEndsAt: Date | null,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private deletedAt: Date | null = null
  ) {
    this.validatePeriodDates(currentPeriodStart, currentPeriodEnd);
    if (trialEndsAt) {
      this.validateTrialDate(trialEndsAt, currentPeriodStart);
    }
  }

  /**
   * Factory method to create a new subscription
   * Initial subscription starts in TRIALING status with 7-day trial
   */
  static create(props: {
    id: string;
    userId: string;
    communityId: string;
    paymentTierId: string;
    stripeSubscriptionId?: string | null;
    stripeCustomerId?: string | null;
    status?: SubscriptionStatus;
    interval: BillingInterval;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    trialEndsAt?: Date | null;
  }): Subscription {
    return new Subscription(
      props.id,
      props.userId,
      props.communityId,
      props.paymentTierId,
      props.stripeSubscriptionId || null,
      props.stripeCustomerId || null,
      props.status || SubscriptionStatus.TRIALING,
      props.interval,
      props.currentPeriodStart,
      props.currentPeriodEnd,
      false, // cancelAtPeriodEnd
      props.trialEndsAt || null,
      new Date(),
      new Date(),
      null
    );
  }

  /**
   * Factory method to reconstitute subscription from persistence
   */
  static reconstitute(props: {
    id: string;
    userId: string;
    communityId: string;
    paymentTierId: string;
    stripeSubscriptionId: string | null;
    stripeCustomerId: string | null;
    status: SubscriptionStatus;
    interval: BillingInterval;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    trialEndsAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): Subscription {
    return new Subscription(
      props.id,
      props.userId,
      props.communityId,
      props.paymentTierId,
      props.stripeSubscriptionId,
      props.stripeCustomerId,
      props.status,
      props.interval,
      props.currentPeriodStart,
      props.currentPeriodEnd,
      props.cancelAtPeriodEnd,
      props.trialEndsAt,
      props.createdAt,
      props.updatedAt,
      props.deletedAt
    );
  }

  // Getters
  public getId(): string {
    return this.id;
  }
  public getUserId(): string {
    return this.userId;
  }
  public getCommunityId(): string {
    return this.communityId;
  }
  public getPaymentTierId(): string {
    return this.paymentTierId;
  }
  public getStripeSubscriptionId(): string | null {
    return this.stripeSubscriptionId;
  }
  public getStripeCustomerId(): string | null {
    return this.stripeCustomerId;
  }
  public getStatus(): SubscriptionStatus {
    return this.status;
  }
  public getInterval(): BillingInterval {
    return this.interval;
  }
  public getCurrentPeriodStart(): Date {
    return this.currentPeriodStart;
  }
  public getCurrentPeriodEnd(): Date {
    return this.currentPeriodEnd;
  }
  public getCancelAtPeriodEnd(): boolean {
    return this.cancelAtPeriodEnd;
  }
  public getTrialEndsAt(): Date | null {
    return this.trialEndsAt;
  }
  public getCreatedAt(): Date {
    return this.createdAt;
  }
  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
  public getDeletedAt(): Date | null {
    return this.deletedAt;
  }

  // Business logic methods

  /**
   * Update Stripe IDs after checkout completion
   */
  public updateStripeIds(
    subscriptionId: string,
    customerId: string
  ): void {
    this.stripeSubscriptionId = subscriptionId;
    this.stripeCustomerId = customerId;
    this.updatedAt = new Date();
  }

  /**
   * Update subscription status
   */
  public updateStatus(status: SubscriptionStatus): void {
    this.ensureNotArchived();
    this.status = status;
    this.updatedAt = new Date();
  }

  /**
   * Activate subscription (trial ended or payment succeeded).
   * @throws Error if subscription is archived or already active
   */
  public activate(): void {
    this.ensureNotArchived();

    if (this.status === SubscriptionStatus.ACTIVE) {
      throw new Error("Subscription is already active");
    }

    this.status = SubscriptionStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  /**
   * Cancel the subscription at the end of the current period.
   * Does not cancel immediately to allow access until period ends.
   * @throws Error if subscription is archived or already cancelled
   */
  public cancel(): void {
    this.ensureNotArchived();

    if (this.status === SubscriptionStatus.CANCELLED) {
      throw new Error("Subscription is already cancelled");
    }

    if (this.cancelAtPeriodEnd) {
      throw new Error("Subscription is already scheduled for cancellation");
    }

    this.cancelAtPeriodEnd = true;
    this.updatedAt = new Date();
  }

  /**
   * Cancel subscription immediately (soft delete).
   * @throws Error if subscription is archived or already cancelled
   */
  public cancelImmediately(): void {
    this.ensureNotArchived();

    if (this.status === SubscriptionStatus.CANCELLED) {
      throw new Error("Subscription is already cancelled");
    }

    this.status = SubscriptionStatus.CANCELLED;
    this.cancelAtPeriodEnd = false;
    this.deletedAt = new Date();
  }

  /**
   * Mark subscription as past due (payment failed).
   * @throws Error if subscription is archived
   */
  public markPastDue(): void {
    this.ensureNotArchived();

    if (this.status === SubscriptionStatus.CANCELLED) {
      throw new Error("Cannot mark cancelled subscription as past due");
    }

    this.status = SubscriptionStatus.PAST_DUE;
    this.updatedAt = new Date();
  }

  /**
   * Start a trial period for the subscription.
   * V1: 7-day trial from now.
   * @throws Error if subscription is archived or already trialing
   */
  public startTrial(): void {
    this.ensureNotArchived();

    if (this.status === SubscriptionStatus.TRIALING) {
      throw new Error("Subscription is already in trial period");
    }

    if (this.status === SubscriptionStatus.CANCELLED) {
      throw new Error("Cannot start trial for cancelled subscription");
    }

    this.status = SubscriptionStatus.TRIALING;
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7); // 7-day trial
    this.trialEndsAt = trialEnd;
    this.updatedAt = new Date();
  }

  /**
   * Renew subscription period (successful payment).
   * @throws Error if subscription is archived or new period is invalid
   */
  public renewPeriod(newPeriodEnd: Date): void {
    this.ensureNotArchived();

    if (this.status === SubscriptionStatus.CANCELLED) {
      throw new Error("Cannot renew cancelled subscription");
    }

    const newPeriodStart = this.currentPeriodEnd;
    this.validatePeriodDates(newPeriodStart, newPeriodEnd);

    this.currentPeriodStart = newPeriodStart;
    this.currentPeriodEnd = newPeriodEnd;
    this.cancelAtPeriodEnd = false;

    // If was trialing and trial ended, mark as active
    if (this.status === SubscriptionStatus.TRIALING) {
      this.status = SubscriptionStatus.ACTIVE;
      this.trialEndsAt = null;
    }

    this.updatedAt = new Date();
  }

  /**
   * Check if subscription is currently active
   */
  public isActive(): boolean {
    return this.status === SubscriptionStatus.ACTIVE;
  }

  /**
   * Check if subscription is in trial period
   */
  public isTrialing(): boolean {
    return this.status === SubscriptionStatus.TRIALING;
  }

  /**
   * Check if subscription is past due
   */
  public isPastDue(): boolean {
    return this.status === SubscriptionStatus.PAST_DUE;
  }

  /**
   * Check if subscription is cancelled
   */
  public isCancelled(): boolean {
    return this.status === SubscriptionStatus.CANCELLED;
  }

  /**
   * Check if subscription is archived (soft deleted)
   */
  public isArchived(): boolean {
    return this.deletedAt !== null;
  }

  /**
   * Restore subscription from archived state.
   * @throws Error if subscription is not archived
   */
  public restore(): void {
    if (!this.isArchived()) {
      throw new Error("Subscription is not archived");
    }

    this.deletedAt = null;
    this.updatedAt = new Date();
  }

  /**
   * Archive (soft delete) the subscription.
   * @throws Error if subscription is already archived
   */
  public archive(): void {
    if (this.isArchived()) {
      throw new Error("Subscription is already archived");
    }

    this.deletedAt = new Date();
  }

  // Private validation methods

  private validatePeriodDates(start: Date, end: Date): void {
    if (end <= start) {
      throw new Error("Period end must be after period start");
    }
  }

  private validateTrialDate(trialEnd: Date, periodStart: Date): void {
    if (trialEnd <= periodStart) {
      throw new Error("Trial end must be after period start");
    }
  }

  private ensureNotArchived(): void {
    if (this.isArchived()) {
      throw new Error("Cannot modify archived subscription");
    }
  }
}
