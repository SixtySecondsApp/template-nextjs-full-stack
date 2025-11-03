/**
 * Domain Events for Subscription Aggregate
 * Published when subscription state changes
 */

import { SubscriptionStatus } from './subscription-status.enum';

/**
 * Published when a user completes checkout and creates a subscription
 */
export class SubscriptionCreatedEvent {
  constructor(
    public readonly subscriptionId: string,
    public readonly userId: string,
    public readonly communityId: string,
    public readonly paymentTierId: string,
    public readonly status: SubscriptionStatus,
    public readonly trialEndsAt: Date | null,
    public readonly occurredAt: Date = new Date()
  ) {}
}

/**
 * Published when subscription status changes (renewed, cancelled, past due)
 */
export class SubscriptionStatusUpdatedEvent {
  constructor(
    public readonly subscriptionId: string,
    public readonly oldStatus: SubscriptionStatus,
    public readonly newStatus: SubscriptionStatus,
    public readonly occurredAt: Date = new Date()
  ) {}
}

/**
 * Published when subscription is cancelled
 */
export class SubscriptionCancelledEvent {
  constructor(
    public readonly subscriptionId: string,
    public readonly userId: string,
    public readonly communityId: string,
    public readonly cancelAtPeriodEnd: boolean,
    public readonly occurredAt: Date = new Date()
  ) {}
}

/**
 * Published when subscription period is renewed
 */
export class SubscriptionRenewedEvent {
  constructor(
    public readonly subscriptionId: string,
    public readonly userId: string,
    public readonly newPeriodEnd: Date,
    public readonly occurredAt: Date = new Date()
  ) {}
}

/**
 * Published when payment fails and subscription becomes past due
 */
export class SubscriptionPaymentFailedEvent {
  constructor(
    public readonly subscriptionId: string,
    public readonly userId: string,
    public readonly communityId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}
