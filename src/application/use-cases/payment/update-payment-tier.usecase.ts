/**
 * Update Payment Tier Use Case
 * Updates payment tier with Stripe synchronization
 */

import { IPaymentTierRepository } from "@/ports/repositories";
import { IStripeAdapter } from "@/ports/stripe.adapter";
import {
  UpdatePaymentTierDto,
  PaymentTierDto,
} from "@/application/dtos/payment-tier.dto";
import { PaymentTierDtoMapper } from "@/application/mappers/payment-tier-dto.mapper";
import { PaymentTierError } from "@/application/errors/payment.errors";

/**
 * Update Payment Tier Use Case
 */
export class UpdatePaymentTierUseCase {
  constructor(
    private readonly paymentTierRepository: IPaymentTierRepository,
    private readonly stripeAdapter: IStripeAdapter
  ) {}

  async execute(
    id: string,
    input: UpdatePaymentTierDto,
    requestUserId: string,
    requestUserCommunityId: string
  ): Promise<PaymentTierDto> {
    try {
      // Validate input
      if (!id) {
        throw new Error(PaymentTierError.INVALID_INPUT);
      }

      // Find tier
      const tier = await this.paymentTierRepository.findById(id);
      if (!tier) {
        throw new Error(PaymentTierError.TIER_NOT_FOUND);
      }

      // Verify community ownership
      if (tier.getCommunityId() !== requestUserCommunityId) {
        throw new Error(PaymentTierError.UNAUTHORIZED);
      }

      // Validate pricing if provided
      if (input.priceMonthly !== undefined && input.priceMonthly < 0) {
        throw new Error(PaymentTierError.INVALID_PRICE);
      }
      if (input.priceAnnual !== undefined && input.priceAnnual < 0) {
        throw new Error(PaymentTierError.INVALID_PRICE);
      }

      // Update domain entity via domain method
      // TODO: Replace with actual tier.update() call once domain entity exists
      if (input.name !== undefined) {
        // tier.updateName(input.name);
      }
      if (input.description !== undefined) {
        // tier.updateDescription(input.description);
      }
      if (input.features !== undefined) {
        // tier.updateFeatures(input.features);
      }
      if (input.isActive !== undefined) {
        // tier.setIsActive(input.isActive);
      }

      // Sync with Stripe if name/description changed and tier has Stripe product
      const stripeProductId = tier.getStripeProductId();
      if (
        stripeProductId &&
        (input.name !== undefined || input.description !== undefined)
      ) {
        try {
          await this.stripeAdapter.updateProduct(
            stripeProductId,
            input.name ?? tier.getName(),
            input.description ?? tier.getDescription()
          );
        } catch (error) {
          throw new Error(PaymentTierError.STRIPE_ERROR);
        }
      }

      // Note: Price changes not supported in V1
      // Would require creating new Stripe prices and migrating subscriptions

      // Save updated tier
      const savedTier = await this.paymentTierRepository.update(tier);

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
