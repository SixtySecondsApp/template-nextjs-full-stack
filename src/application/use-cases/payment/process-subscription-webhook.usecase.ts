/**
 * ProcessSubscriptionWebhookUseCase
 * Orchestrates subscription state changes based on Stripe webhook events
 * Application layer - no business logic, only coordination
 */

import { Subscription } from '@/domain/payment/subscription.entity';
import { SubscriptionStatus, BillingInterval } from '@/domain/payment/subscription-status.enum';

// Repository interface placeholders - will be properly typed in infrastructure
export interface ISubscriptionRepository {
  findByUserAndCommunity(userId: string, communityId: string): Promise<Subscription | null>;
  findByStripeSubscriptionId(stripeSubscriptionId: string): Promise<Subscription | null>;
  create(subscription: Subscription): Promise<Subscription>;
  update(subscription: Subscription): Promise<Subscription>;
}

export class ProcessSubscriptionWebhookUseCase {
  constructor(
    private subscriptionRepository: ISubscriptionRepository
  ) {}

  /**
   * Handle checkout.session.completed event
   * Creates or updates subscription when user completes Stripe checkout
   */
  async handleCheckoutCompleted(session: any): Promise<void> {
    const { subscription: stripeSubscriptionId, customer: stripeCustomerId, metadata } = session;

    // Extract metadata attached during checkout creation
    const userId = metadata?.userId;
    const communityId = metadata?.communityId;
    const paymentTierId = metadata?.paymentTierId;
    const interval = metadata?.interval as BillingInterval;

    if (!userId || !communityId || !paymentTierId || !interval) {
      throw new Error('Missing required metadata in checkout session');
    }

    // Check if subscription already exists
    let subscription = await this.subscriptionRepository.findByUserAndCommunity(
      userId,
      communityId
    );

    if (!subscription) {
      // Create new subscription entity
      subscription = Subscription.create({
        id: crypto.randomUUID(),
        userId,
        communityId,
        paymentTierId,
        stripeSubscriptionId,
        stripeCustomerId,
        status: SubscriptionStatus.TRIALING, // 7-day trial
        interval,
        currentPeriodStart: new Date(session.subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(session.subscription.current_period_end * 1000),
        trialEndsAt: session.subscription.trial_end
          ? new Date(session.subscription.trial_end * 1000)
          : null,
      });

      await this.subscriptionRepository.create(subscription);
    } else {
      // Update existing subscription with Stripe IDs
      subscription.updateStripeIds(stripeSubscriptionId, stripeCustomerId);
      await this.subscriptionRepository.update(subscription);
    }
  }

  /**
   * Handle customer.subscription.updated event
   * Updates subscription status when Stripe subscription changes
   */
  async handleSubscriptionUpdated(stripeSubscription: any): Promise<void> {
    // Find subscription by Stripe ID
    const subscription = await this.subscriptionRepository.findByStripeSubscriptionId(
      stripeSubscription.id
    );

    if (!subscription) {
      console.warn(`[Webhook] Subscription not found: ${stripeSubscription.id}`);
      return;
    }

    // Map Stripe status to domain status
    const statusMap: Record<string, SubscriptionStatus> = {
      'active': SubscriptionStatus.ACTIVE,
      'canceled': SubscriptionStatus.CANCELLED,
      'past_due': SubscriptionStatus.PAST_DUE,
      'trialing': SubscriptionStatus.TRIALING,
    };

    const newStatus = statusMap[stripeSubscription.status];
    if (newStatus) {
      subscription.updateStatus(newStatus);
    }

    // Update subscription period
    subscription.renewPeriod(
      new Date(stripeSubscription.current_period_end * 1000)
    );

    // Handle cancellation flag
    if (stripeSubscription.cancel_at_period_end) {
      subscription.cancel(); // Sets cancelAtPeriodEnd=true
    }

    await this.subscriptionRepository.update(subscription);
  }

  /**
   * Handle customer.subscription.deleted event
   * Permanently cancels subscription when Stripe deletes it
   */
  async handleSubscriptionDeleted(stripeSubscription: any): Promise<void> {
    const subscription = await this.subscriptionRepository.findByStripeSubscriptionId(
      stripeSubscription.id
    );

    if (!subscription) {
      console.warn(`[Webhook] Subscription not found: ${stripeSubscription.id}`);
      return;
    }

    subscription.cancelImmediately(); // Soft delete
    await this.subscriptionRepository.update(subscription);
  }

  /**
   * Handle invoice.payment_succeeded event
   * Activates subscription if payment succeeds after past due
   */
  async handlePaymentSucceeded(invoice: any): Promise<void> {
    if (!invoice.subscription) {
      // Not a subscription invoice, ignore
      return;
    }

    const subscription = await this.subscriptionRepository.findByStripeSubscriptionId(
      invoice.subscription
    );

    if (!subscription) {
      console.warn(`[Webhook] Subscription not found: ${invoice.subscription}`);
      return;
    }

    // If subscription was past due, reactivate it
    if (subscription.isPastDue()) {
      subscription.activate();
      await this.subscriptionRepository.update(subscription);
    }
  }

  /**
   * Handle invoice.payment_failed event
   * Marks subscription as past due when payment fails
   */
  async handlePaymentFailed(invoice: any): Promise<void> {
    if (!invoice.subscription) {
      // Not a subscription invoice, ignore
      return;
    }

    const subscription = await this.subscriptionRepository.findByStripeSubscriptionId(
      invoice.subscription
    );

    if (!subscription) {
      console.warn(`[Webhook] Subscription not found: ${invoice.subscription}`);
      return;
    }

    subscription.markPastDue();
    await this.subscriptionRepository.update(subscription);

    // TODO: Trigger email notification to user about failed payment
    // This should be handled by event subscribers in infrastructure
  }
}
