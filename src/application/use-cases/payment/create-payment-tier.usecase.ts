/**
 * Create Payment Tier Use Case
 * Orchestrates payment tier creation with Stripe product setup
 */

// TODO: Import actual domain entities once created
// import { PaymentTier } from "@/domain/payment-tier/payment-tier.entity";
type PaymentTier = any; // Placeholder

import {
  IPaymentTierRepository,
  ICommunityRepository,
} from "@/ports/repositories";
import { IStripeAdapter } from "@/ports/stripe.adapter";
import {
  CreatePaymentTierDto,
  PaymentTierDto,
} from "@/application/dtos/payment-tier.dto";
import { PaymentTierDtoMapper } from "@/application/mappers/payment-tier-dto.mapper";
import { PaymentTierError } from "@/application/errors/payment.errors";

/**
 * Create Payment Tier Use Case
 */
export class CreatePaymentTierUseCase {
  constructor(
    private readonly paymentTierRepository: IPaymentTierRepository,
    private readonly communityRepository: ICommunityRepository,
    private readonly stripeAdapter: IStripeAdapter
  ) {}

  async execute(input: CreatePaymentTierDto): Promise<PaymentTierDto> {
    try {
      // Validate community exists
      const community = await this.communityRepository.findById(
        input.communityId
      );
      if (!community) {
        throw new Error(PaymentTierError.COMMUNITY_NOT_FOUND);
      }

      // V1 Constraint: Maximum 2 tiers (1 free + 1 paid)
      const existingTiers = await this.paymentTierRepository.findByCommunityId(
        input.communityId
      );
      if (existingTiers.length >= 2) {
        throw new Error(PaymentTierError.MAX_TIERS_REACHED);
      }

      // Validate pricing
      if (input.priceMonthly < 0 || input.priceAnnual < 0) {
        throw new Error(PaymentTierError.INVALID_PRICE);
      }

      const isFree = input.priceMonthly === 0 && input.priceAnnual === 0;

      // Check if free tier already exists
      if (isFree) {
        const freeTier = await this.paymentTierRepository.findFreeTier(
          input.communityId
        );
        if (freeTier) {
          throw new Error(PaymentTierError.MAX_TIERS_REACHED);
        }
      }

      // Create domain entity (placeholder - replace with actual PaymentTier.create())
      const id = crypto.randomUUID();
      const tierProps = PaymentTierDtoMapper.fromCreateDto(input, id);

      let stripeProductId: string | null = null;
      let stripePriceMonthlyId: string | null = null;
      let stripePriceAnnualId: string | null = null;

      // Create Stripe product and prices for paid tiers
      if (!isFree) {
        try {
          const stripeResult = await this.stripeAdapter.createProduct(
            input.name,
            input.description,
            input.priceMonthly,
            input.priceAnnual
          );

          stripeProductId = stripeResult.productId;
          stripePriceMonthlyId = stripeResult.priceMonthlyId;
          stripePriceAnnualId = stripeResult.priceAnnualId;
        } catch (error) {
          throw new Error(PaymentTierError.STRIPE_ERROR);
        }
      }

      // Create tier with Stripe IDs
      // TODO: Replace with actual PaymentTier.create() call
      const tier = {
        ...tierProps,
        stripeProductId,
        stripePriceMonthlyId,
        stripePriceAnnualId,
        getId: () => id,
        getCommunityId: () => input.communityId,
        getName: () => input.name,
        getDescription: () => input.description,
        getPriceMonthly: () => input.priceMonthly,
        getPriceAnnual: () => input.priceAnnual,
        getFeatures: () => input.features,
        getIsActive: () => true,
        getIsFree: () => isFree,
        getStripeProductId: () => stripeProductId,
        getStripePriceMonthlyId: () => stripePriceMonthlyId,
        getStripePriceAnnualId: () => stripePriceAnnualId,
        getCreatedAt: () => new Date(),
        getUpdatedAt: () => new Date(),
      } as any;

      // Persist via repository
      const savedTier = await this.paymentTierRepository.create(tier);

      // Return DTO
      return PaymentTierDtoMapper.toDto(savedTier);
    } catch (error) {
      if (error instanceof Error) {
        // Re-throw known application errors
        if (
          Object.values(PaymentTierError).includes(
            error.message as PaymentTierError
          )
        ) {
          throw error;
        }
      }

      // Unknown error
      throw new Error(PaymentTierError.INTERNAL_SERVER_ERROR);
    }
  }
}
