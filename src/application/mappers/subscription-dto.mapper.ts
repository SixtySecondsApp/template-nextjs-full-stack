/**
 * Subscription DTO Mapper
 * Handles conversion between Subscription domain entities and DTOs
 * Maintains strict boundary between domain and application layers
 */

// TODO: Import actual Subscription entity once created
// import { Subscription } from "@/domain/subscription/subscription.entity";
type Subscription = any; // Placeholder

import {
  SubscriptionDto,
  CreateSubscriptionDto,
  SubscriptionStatusDto,
} from "@/application/dtos/subscription.dto";

/**
 * Subscription DTO Mapper
 */
export class SubscriptionDtoMapper {
  /**
   * Convert Subscription domain entity to DTO
   * @param subscription Domain entity
   * @param paymentTierName Enriched tier name from PaymentTier
   * @returns SubscriptionDto
   */
  static toDto(subscription: any, paymentTierName: string): SubscriptionDto {
    const status = subscription.getStatus();
    const isActive =
      status === "ACTIVE" || status === "TRIALING" || status === "active" || status === "trialing";

    return {
      id: subscription.getId(),
      userId: subscription.getUserId(),
      communityId: subscription.getCommunityId(),
      paymentTierId: subscription.getPaymentTierId(),
      paymentTierName,
      status: subscription.getStatus(),
      interval: subscription.getInterval(),
      currentPeriodStart: subscription.getCurrentPeriodStart().toISOString(),
      currentPeriodEnd: subscription.getCurrentPeriodEnd().toISOString(),
      cancelAtPeriodEnd: subscription.getCancelAtPeriodEnd(),
      trialEndsAt: subscription.getTrialEndsAt()
        ? subscription.getTrialEndsAt().toISOString()
        : null,
      stripeSubscriptionId: subscription.getStripeSubscriptionId(),
      stripeCustomerId: subscription.getStripeCustomerId(),
      isActive,
      createdAt: subscription.getCreatedAt().toISOString(),
      updatedAt: subscription.getUpdatedAt().toISOString(),
    };
  }

  /**
   * Convert Subscription to simplified status DTO
   * @param subscription Domain entity or null
   * @param paymentTierName Enriched tier name (if subscription exists)
   * @returns SubscriptionStatusDto
   */
  static toStatusDto(
    subscription: any | null,
    paymentTierName: string | null
  ): SubscriptionStatusDto {
    if (!subscription) {
      return {
        hasActiveSubscription: false,
        status: null,
        tierName: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      };
    }

    const status = subscription.getStatus();
    const isActive =
      status === "ACTIVE" || status === "TRIALING" || status === "active" || status === "trialing";

    return {
      hasActiveSubscription: isActive,
      status: subscription.getStatus(),
      tierName: paymentTierName,
      currentPeriodEnd: subscription.getCurrentPeriodEnd().toISOString(),
      cancelAtPeriodEnd: subscription.getCancelAtPeriodEnd(),
    };
  }

  /**
   * Convert CreateSubscriptionDto to domain entity creation props
   * @param dto CreateSubscriptionDto
   * @param id Generated ID
   * @returns Props for Subscription.create()
   */
  static fromCreateDto(
    dto: CreateSubscriptionDto,
    id: string
  ): Record<string, any> {
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7); // V1: 7-day trial

    return {
      id,
      userId: dto.userId,
      communityId: dto.communityId,
      paymentTierId: dto.paymentTierId,
      interval: dto.interval,
      status: "TRIALING",
      trialEndsAt,
    };
  }

  /**
   * Convert multiple domain entities to DTOs
   * @param subscriptions Array of domain entities
   * @param getTierName Function to get tier name by tier ID
   * @returns Array of DTOs
   */
  static async toDtoArray(
    subscriptions: any[],
    getTierName: (tierId: string) => Promise<string>
  ): Promise<SubscriptionDto[]> {
    return Promise.all(
      subscriptions.map(async (subscription) => {
        const tierName = await getTierName(subscription.getPaymentTierId());
        return this.toDto(subscription, tierName);
      })
    );
  }
}
