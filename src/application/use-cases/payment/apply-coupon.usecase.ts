/**
 * Apply Coupon Use Case
 * Validates and applies coupon code with discount calculation
 */

import { ICouponRepository } from "@/ports/repositories";
import { AppliedCouponDto } from "@/application/dtos/coupon.dto";
import { CouponDtoMapper } from "@/application/mappers/coupon-dto.mapper";
import { CouponError } from "@/application/errors/payment.errors";

/**
 * Apply Coupon Use Case
 * Validates coupon and returns calculated discount
 */
export class ApplyCouponUseCase {
  constructor(private readonly couponRepository: ICouponRepository) {}

  async execute(
    code: string,
    communityId: string,
    subtotal: number
  ): Promise<AppliedCouponDto> {
    try {
      // Validate input
      if (!code || !communityId) {
        throw new Error(CouponError.INVALID_INPUT);
      }

      if (subtotal < 0) {
        throw new Error(CouponError.INVALID_INPUT);
      }

      // Normalize code
      const normalizedCode = code.toUpperCase().trim();

      // Find coupon
      const coupon = await this.couponRepository.findByCodeAndCommunity(
        normalizedCode,
        communityId
      );

      if (!coupon) {
        throw new Error(CouponError.COUPON_NOT_FOUND);
      }

      // Check if coupon is available (active, not expired, under max uses)
      if (!coupon.isAvailable()) {
        if (!coupon.getIsActive()) {
          throw new Error(CouponError.COUPON_INACTIVE);
        }

        const expiresAt = coupon.getExpiresAt();
        if (expiresAt && expiresAt < new Date()) {
          throw new Error(CouponError.COUPON_EXPIRED);
        }

        const maxUses = coupon.getMaxUses();
        const usedCount = coupon.getUsedCount();
        if (maxUses !== null && usedCount >= maxUses) {
          throw new Error(CouponError.MAX_USES_REACHED);
        }
      }

      // Increment used count (domain method)
      // TODO: Replace with actual coupon.use() call
      // coupon.use();

      // Save updated coupon
      await this.couponRepository.update(coupon);

      // Return applied coupon with calculated discount
      return CouponDtoMapper.toAppliedDto(coupon, subtotal);
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

  /**
   * Validate coupon without incrementing usage count
   * Used for checkout calculation preview
   */
  async validate(
    code: string,
    communityId: string,
    subtotal: number
  ): Promise<AppliedCouponDto> {
    try {
      // Validate input
      if (!code || !communityId) {
        throw new Error(CouponError.INVALID_INPUT);
      }

      if (subtotal < 0) {
        throw new Error(CouponError.INVALID_INPUT);
      }

      // Normalize code
      const normalizedCode = code.toUpperCase().trim();

      // Find coupon
      const coupon = await this.couponRepository.findByCodeAndCommunity(
        normalizedCode,
        communityId
      );

      if (!coupon) {
        throw new Error(CouponError.COUPON_NOT_FOUND);
      }

      // Check if coupon is available
      if (!coupon.isAvailable()) {
        if (!coupon.getIsActive()) {
          throw new Error(CouponError.COUPON_INACTIVE);
        }

        const expiresAt = coupon.getExpiresAt();
        if (expiresAt && expiresAt < new Date()) {
          throw new Error(CouponError.COUPON_EXPIRED);
        }

        const maxUses = coupon.getMaxUses();
        const usedCount = coupon.getUsedCount();
        if (maxUses !== null && usedCount >= maxUses) {
          throw new Error(CouponError.MAX_USES_REACHED);
        }
      }

      // Return applied coupon with calculated discount (without incrementing count)
      return CouponDtoMapper.toAppliedDto(coupon, subtotal);
    } catch (error) {
      if (error instanceof Error) {
        if (
          Object.values(CouponError).includes(error.message as CouponError)
        ) {
          throw error;
        }
      }

      throw new Error(CouponError.INTERNAL_SERVER_ERROR);
    }
  }
}
