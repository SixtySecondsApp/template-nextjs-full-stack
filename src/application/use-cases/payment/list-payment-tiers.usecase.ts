/**
 * List Payment Tiers Use Case
 * Retrieves all payment tiers for a community
 */

import { IPaymentTierRepository } from "@/ports/repositories";
import { PaymentTierDto } from "@/application/dtos/payment-tier.dto";
import { PaymentTierDtoMapper } from "@/application/mappers/payment-tier-dto.mapper";
import { PaymentTierError } from "@/application/errors/payment.errors";

/**
 * List Payment Tiers Use Case
 */
export class ListPaymentTiersUseCase {
  constructor(
    private readonly paymentTierRepository: IPaymentTierRepository
  ) {}

  async execute(communityId: string, includeInactive = false): Promise<PaymentTierDto[]> {
    try {
      // Validate input
      if (!communityId) {
        throw new Error(PaymentTierError.INVALID_INPUT);
      }

      // Find tiers by community ID
      const tiers = await this.paymentTierRepository.findByCommunityId(
        communityId,
        includeInactive
      );

      // Filter active only by default (if repository doesn't handle it)
      const filteredTiers = includeInactive
        ? tiers
        : tiers.filter((tier: any) => tier.getIsActive());

      // Return DTOs
      return PaymentTierDtoMapper.toDtoArray(filteredTiers);
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
