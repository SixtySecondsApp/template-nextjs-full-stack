/**
 * Get Payment Tier Use Case
 * Retrieves a single payment tier by ID
 */

import { IPaymentTierRepository } from "@/ports/repositories";
import { PaymentTierDto } from "@/application/dtos/payment-tier.dto";
import { PaymentTierDtoMapper } from "@/application/mappers/payment-tier-dto.mapper";
import { PaymentTierError } from "@/application/errors/payment.errors";

/**
 * Get Payment Tier Use Case
 */
export class GetPaymentTierUseCase {
  constructor(
    private readonly paymentTierRepository: IPaymentTierRepository
  ) {}

  async execute(id: string): Promise<PaymentTierDto> {
    try {
      // Validate input
      if (!id) {
        throw new Error(PaymentTierError.INVALID_INPUT);
      }

      // Find tier by ID
      const tier = await this.paymentTierRepository.findById(id);

      if (!tier) {
        throw new Error(PaymentTierError.TIER_NOT_FOUND);
      }

      // Return DTO
      return PaymentTierDtoMapper.toDto(tier);
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
