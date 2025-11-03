/**
 * Create Subscription Use Case
 * Initiates subscription checkout with Stripe
 */

// TODO: Import actual domain entities once created
// import { Subscription } from "@/domain/subscription/subscription.entity";
type Subscription = any; // Placeholder

import {
  ISubscriptionRepository,
  IPaymentTierRepository,
  ICouponRepository,
} from "@/ports/repositories";
import { IStripeAdapter } from "@/ports/stripe.adapter";
import {
  CreateSubscriptionDto,
  CreateCheckoutSessionResponseDto,
} from "@/application/dtos/subscription.dto";
import { SubscriptionDtoMapper } from "@/application/mappers/subscription-dto.mapper";
import { SubscriptionError } from "@/application/errors/payment.errors";

/**
 * Create Subscription Use Case
 * Creates pending subscription and returns Stripe checkout URL
 */
export class CreateSubscriptionUseCase {
  constructor(
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly paymentTierRepository: IPaymentTierRepository,
    private readonly couponRepository: ICouponRepository,
    private readonly stripeAdapter: IStripeAdapter
  ) {}

  async execute(
    input: CreateSubscriptionDto
  ): Promise<CreateCheckoutSessionResponseDto> {
    try {
      // Validate input
      if (!input.userId || !input.communityId || !input.paymentTierId) {
        throw new Error(SubscriptionError.INVALID_INPUT);
      }

      if (input.interval !== "MONTHLY" && input.interval !== "ANNUAL") {
        throw new Error(SubscriptionError.INVALID_INPUT);
      }

      // Verify payment tier exists and is active
      const tier = await this.paymentTierRepository.findById(
        input.paymentTierId
      );
      if (!tier) {
        throw new Error(SubscriptionError.TIER_NOT_FOUND);
      }
      if (!tier.getIsActive()) {
        throw new Error(SubscriptionError.TIER_NOT_ACTIVE);
      }

      // Check user doesn't already have active subscription for this community
      const existingSubscription =
        await this.subscriptionRepository.findByUserAndCommunity(
          input.userId,
          input.communityId
        );

      if (existingSubscription) {
        // Check if active
        const status = existingSubscription.getStatus();
        if (status === "ACTIVE" || status === "TRIALING") {
          throw new Error(SubscriptionError.ALREADY_SUBSCRIBED);
        }
      }

      // Validate and retrieve coupon if provided
      let stripeCouponId: string | undefined;
      if (input.couponCode) {
        const coupon = await this.couponRepository.findByCodeAndCommunity(
          input.couponCode,
          input.communityId
        );

        if (!coupon || !coupon.isAvailable()) {
          throw new Error(SubscriptionError.INVALID_INPUT);
        }

        stripeCouponId = coupon.getStripeCouponId();
      }

      // Get Stripe price ID based on interval
      const stripePriceId =
        input.interval === "MONTHLY"
          ? tier.getStripePriceMonthlyId()
          : tier.getStripePriceAnnualId();

      if (!stripePriceId) {
        throw new Error(SubscriptionError.STRIPE_ERROR);
      }

      // Create Stripe checkout session
      let checkoutSession;
      try {
        checkoutSession = await this.stripeAdapter.createCheckoutSession({
          priceId: stripePriceId,
          trialDays: 7, // V1: 7-day trial
          couponId: stripeCouponId,
          successUrl: input.successUrl,
          cancelUrl: input.cancelUrl,
          metadata: {
            userId: input.userId,
            communityId: input.communityId,
            paymentTierId: input.paymentTierId,
            interval: input.interval,
          },
        });
      } catch (error) {
        throw new Error(SubscriptionError.CHECKOUT_FAILED);
      }

      // Create pending subscription entity
      // TODO: Replace with actual Subscription.create() call
      const subscriptionId = crypto.randomUUID();
      const subscriptionProps = SubscriptionDtoMapper.fromCreateDto(
        input,
        subscriptionId
      );

      const subscription = {
        ...subscriptionProps,
        checkoutSessionId: checkoutSession.sessionId,
        getId: () => subscriptionId,
        getUserId: () => input.userId,
        getCommunityId: () => input.communityId,
        getPaymentTierId: () => input.paymentTierId,
        getInterval: () => input.interval,
        getStatus: () => "TRIALING",
        getCurrentPeriodStart: () => new Date(),
        getCurrentPeriodEnd: () => {
          const end = new Date();
          end.setDate(end.getDate() + 7);
          return end;
        },
        getCancelAtPeriodEnd: () => false,
        getTrialEndsAt: () => subscriptionProps.trialEndsAt,
        getStripeSubscriptionId: () => null,
        getStripeCustomerId: () => null,
        getCreatedAt: () => new Date(),
        getUpdatedAt: () => new Date(),
      } as any;

      // Persist pending subscription
      await this.subscriptionRepository.create(subscription);

      // Return checkout URL and subscription ID
      return {
        checkoutUrl: checkoutSession.checkoutUrl,
        subscriptionId,
        sessionId: checkoutSession.sessionId,
      };
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
