/**
 * Coupon DTO Mapper
 * Handles conversion between Coupon domain entities and DTOs
 * Maintains strict boundary between domain and application layers
 */

// TODO: Import actual Coupon entity once created
// import { Coupon } from "@/domain/coupon/coupon.entity";
type Coupon = any; // Placeholder

import {
  CouponDto,
  CreateCouponDto,
  AppliedCouponDto,
} from "@/application/dtos/coupon.dto";

/**
 * Coupon DTO Mapper
 */
export class CouponDtoMapper {
  /**
   * Convert Coupon domain entity to DTO
   * @param coupon Domain entity
   * @returns CouponDto
   */
  static toDto(coupon: any): CouponDto {
    return {
      id: coupon.getId(),
      communityId: coupon.getCommunityId(),
      code: coupon.getCode(),
      discountType: coupon.getDiscountType(),
      discountValue: coupon.getDiscountValue(),
      expiresAt: coupon.getExpiresAt()
        ? coupon.getExpiresAt().toISOString()
        : null,
      maxUses: coupon.getMaxUses(),
      usedCount: coupon.getUsedCount(),
      isActive: coupon.getIsActive(),
      isAvailable: coupon.isAvailable(), // Domain method
      stripeCouponId: coupon.getStripeCouponId(),
      createdAt: coupon.getCreatedAt().toISOString(),
      updatedAt: coupon.getUpdatedAt().toISOString(),
    };
  }

  /**
   * Convert Coupon to applied coupon DTO with calculated discount
   * @param coupon Domain entity
   * @param subtotal Subtotal amount in cents
   * @returns AppliedCouponDto
   */
  static toAppliedDto(coupon: any, subtotal: number): AppliedCouponDto {
    const discountType = coupon.getDiscountType();
    const discountValue = coupon.getDiscountValue();

    let discountAmount = 0;
    if (discountType === "PERCENTAGE") {
      // Calculate percentage discount
      discountAmount = Math.round((subtotal * discountValue) / 100);
    } else if (discountType === "FIXED_AMOUNT") {
      // Fixed amount discount (in cents)
      discountAmount = Math.min(discountValue, subtotal);
    }

    return {
      id: coupon.getId(),
      code: coupon.getCode(),
      discountType,
      discountValue,
      discountAmount,
    };
  }

  /**
   * Convert CreateCouponDto to domain entity creation props
   * @param dto CreateCouponDto
   * @param id Generated ID
   * @returns Props for Coupon.create()
   */
  static fromCreateDto(
    dto: CreateCouponDto,
    id: string
  ): Record<string, any> {
    return {
      id,
      communityId: dto.communityId,
      code: dto.code.toUpperCase(), // Normalize to uppercase
      discountType: dto.discountType,
      discountValue: dto.discountValue,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      maxUses: dto.maxUses ?? null,
      usedCount: 0,
      isActive: true,
    };
  }

  /**
   * Convert multiple domain entities to DTOs
   * @param coupons Array of domain entities
   * @returns Array of DTOs
   */
  static toDtoArray(coupons: any[]): CouponDto[] {
    return coupons.map((coupon) => this.toDto(coupon));
  }
}
