/**
 * Activate Payment Tier Use Case
 * Activates or deactivates a payment tier
 */

import { IPaymentTierRepository } from "@/ports/repositories";
import { PaymentTierDto } from "@/application/dtos/payment-tier.dto";
import { PaymentTierDtoMapper } from "@/application/mappers/payment-tier-dto.mapper";
import { PaymentTierError } from "@/application/errors/payment.errors";

/**
 * Activate Payment Tier Use Case
 */
export class ActivatePaymentTierUseCase {
  constructor(
    private readonly paymentTierRepository: IPaymentTierRepository
  ) {}

  async execute(
    id: string,
    isActive: boolean,
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

      // Update activation status via domain method
      // TODO: Replace with actual tier.activate() / tier.deactivate() call
      if (isActive) {
        // tier.activate();
      } else {
        // tier.deactivate();
      }

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
