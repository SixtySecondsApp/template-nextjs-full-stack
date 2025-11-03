/**
 * SubscriptionPrismaMapper
 * Maps between Subscription domain entity and Prisma model
 * Infrastructure layer - maintains boundary between domain and persistence
 */

import { Subscription } from '@/domain/payment/subscription.entity';
import { SubscriptionStatus, BillingInterval } from '@/domain/payment/subscription-status.enum';

type SubscriptionPersistence = {
  id: string;
  userId: string;
  communityId: string;
  paymentTierId: string;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  status: string;
  interval: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEndsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export class SubscriptionPrismaMapper {
  /**
   * Convert from Prisma model to domain entity
   */
  static toDomain(raw: SubscriptionPersistence): Subscription {
    return Subscription.reconstitute({
      id: raw.id,
      userId: raw.userId,
      communityId: raw.communityId,
      paymentTierId: raw.paymentTierId,
      stripeSubscriptionId: raw.stripeSubscriptionId,
      stripeCustomerId: raw.stripeCustomerId,
      status: raw.status as SubscriptionStatus,
      interval: raw.interval as BillingInterval,
      currentPeriodStart: raw.currentPeriodStart,
      currentPeriodEnd: raw.currentPeriodEnd,
      cancelAtPeriodEnd: raw.cancelAtPeriodEnd,
      trialEndsAt: raw.trialEndsAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  /**
   * Convert from domain entity to Prisma model
   */
  static toPersistence(subscription: Subscription): SubscriptionPersistence {
    return {
      id: subscription.getId(),
      userId: subscription.getUserId(),
      communityId: subscription.getCommunityId(),
      paymentTierId: subscription.getPaymentTierId(),
      stripeSubscriptionId: subscription.getStripeSubscriptionId(),
      stripeCustomerId: subscription.getStripeCustomerId(),
      status: subscription.getStatus(),
      interval: subscription.getInterval(),
      currentPeriodStart: subscription.getCurrentPeriodStart(),
      currentPeriodEnd: subscription.getCurrentPeriodEnd(),
      cancelAtPeriodEnd: subscription.getCancelAtPeriodEnd(),
      trialEndsAt: subscription.getTrialEndsAt(),
      createdAt: subscription.getCreatedAt(),
      updatedAt: subscription.getUpdatedAt(),
      deletedAt: subscription.getDeletedAt(),
    };
  }
}
