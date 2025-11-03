/**
 * Cancel Subscription Use Case
 * Cancels subscription at period end via Stripe
 */

import { ISubscriptionRepository } from "@/ports/repositories";
import { IStripeAdapter } from "@/ports/stripe.adapter";
import { SubscriptionDto } from "@/application/dtos/subscription.dto";
import { SubscriptionDtoMapper } from "@/application/mappers/subscription-dto.mapper";
import { SubscriptionError } from "@/application/errors/payment.errors";

/**
 * Cancel Subscription Use Case
 * Cancels subscription at end of current period
 */
export class CancelSubscriptionUseCase {
  constructor(
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly stripeAdapter: IStripeAdapter
  ) {}

  async execute(
    subscriptionId: string,
    requestUserId: string
  ): Promise<SubscriptionDto> {
    try {
      // Validate input
      if (!subscriptionId || !requestUserId) {
        throw new Error(SubscriptionError.INVALID_INPUT);
      }

      // Find subscription
      const subscription =
        await this.subscriptionRepository.findById(subscriptionId);

      if (!subscription) {
        throw new Error(SubscriptionError.SUBSCRIPTION_NOT_FOUND);
      }

      // Verify user owns this subscription
      if (subscription.getUserId() !== requestUserId) {
        throw new Error(SubscriptionError.UNAUTHORIZED);
      }

      // Cancel via Stripe (cancel at period end)
      const stripeSubscriptionId = subscription.getStripeSubscriptionId();
      if (!stripeSubscriptionId) {
        throw new Error(SubscriptionError.STRIPE_ERROR);
      }

      try {
        await this.stripeAdapter.cancelSubscription(stripeSubscriptionId);
      } catch (error) {
        throw new Error(SubscriptionError.STRIPE_ERROR);
      }

      // Update subscription entity via domain method
      // TODO: Replace with actual subscription.cancel() call
      // subscription.cancel(); // Sets cancelAtPeriodEnd = true

      // Save updated subscription
      const savedSubscription =
        await this.subscriptionRepository.update(subscription);

      // Get tier name for DTO
      // For simplicity, using placeholder - should fetch from repository
      const tierName = "Paid Tier"; // TODO: Fetch from payment tier repository

      // Return DTO
      return SubscriptionDtoMapper.toDto(savedSubscription, tierName);
    } catch (error) {
      if (error instanceof Error) {
        // Re-throw known application errors
        if (
          Object.values(SubscriptionError).includes(
            error.message as SubscriptionError
          )
        ) {
          throw error;
        }
      }

      // Unknown error
      throw new Error(SubscriptionError.INTERNAL_SERVER_ERROR);
    }
  }
}
