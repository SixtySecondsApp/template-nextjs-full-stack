/**
 * Get Subscription Use Case
 * Retrieves active subscription for a user in a community
 */

import { ISubscriptionRepository, IPaymentTierRepository } from "@/ports/repositories";
import {
  SubscriptionDto,
  SubscriptionStatusDto,
} from "@/application/dtos/subscription.dto";
import { SubscriptionDtoMapper } from "@/application/mappers/subscription-dto.mapper";
import { SubscriptionError } from "@/application/errors/payment.errors";

/**
 * Get Subscription Use Case
 * Returns subscription DTO or null if no active subscription
 */
export class GetSubscriptionUseCase {
  constructor(
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly paymentTierRepository: IPaymentTierRepository
  ) {}

  /**
   * Get full subscription details
   */
  async execute(
    userId: string,
    communityId: string
  ): Promise<SubscriptionDto | null> {
    try {
      // Validate input
      if (!userId || !communityId) {
        throw new Error(SubscriptionError.INVALID_INPUT);
      }

      // Find subscription
      const subscription =
        await this.subscriptionRepository.findByUserAndCommunity(
          userId,
          communityId
        );

      if (!subscription) {
        return null;
      }

      // Get payment tier name for enrichment
      const tier = await this.paymentTierRepository.findById(
        subscription.getPaymentTierId()
      );

      const tierName = tier ? tier.getName() : "Unknown Tier";

      // Return DTO
      return SubscriptionDtoMapper.toDto(subscription, tierName);
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

  /**
   * Get simplified subscription status
   * Used for UI components that only need basic status info
   */
  async getStatus(
    userId: string,
    communityId: string
  ): Promise<SubscriptionStatusDto> {
    try {
      // Validate input
      if (!userId || !communityId) {
        throw new Error(SubscriptionError.INVALID_INPUT);
      }

      // Find subscription
      const subscription =
        await this.subscriptionRepository.findByUserAndCommunity(
          userId,
          communityId
        );

      if (!subscription) {
        return SubscriptionDtoMapper.toStatusDto(null, null);
      }

      // Get payment tier name
      const tier = await this.paymentTierRepository.findById(
        subscription.getPaymentTierId()
      );

      const tierName = tier ? tier.getName() : null;

      // Return status DTO
      return SubscriptionDtoMapper.toStatusDto(subscription, tierName);
    } catch (error) {
      if (error instanceof Error) {
        if (
          Object.values(SubscriptionError).includes(
            error.message as SubscriptionError
          )
        ) {
          throw error;
        }
      }

      throw new Error(SubscriptionError.INTERNAL_SERVER_ERROR);
    }
  }
}
