/**
 * List Coupons Use Case
 * Retrieves all coupons for a community
 */

import { ICouponRepository } from "@/ports/repositories";
import { CouponDto } from "@/application/dtos/coupon.dto";
import { CouponDtoMapper } from "@/application/mappers/coupon-dto.mapper";
import { CouponError } from "@/application/errors/payment.errors";

/**
 * List Coupons Use Case
 */
export class ListCouponsUseCase {
  constructor(private readonly couponRepository: ICouponRepository) {}

  async execute(
    communityId: string,
    includeInactive = false
  ): Promise<CouponDto[]> {
    try {
      // Validate input
      if (!communityId) {
        throw new Error(CouponError.INVALID_INPUT);
      }

      // Find coupons by community ID
      const coupons = await this.couponRepository.findByCommunityId(
        communityId,
        includeInactive
      );

      // Return DTOs
      return CouponDtoMapper.toDtoArray(coupons);
    } catch (error) {
      if (error instanceof Error) {
        // Re-throw known application errors
        if (
          Object.values(CouponError).includes(error.message as CouponError)
        ) {
          throw error;
        }
      }

      // Unknown error
      throw new Error(CouponError.INTERNAL_SERVER_ERROR);
    }
  }
}
