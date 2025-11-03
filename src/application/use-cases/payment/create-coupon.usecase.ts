/**
 * Create Coupon Use Case
 * Creates coupon with Stripe integration
 */

// TODO: Import actual domain entities once created
// import { Coupon } from "@/domain/coupon/coupon.entity";
type Coupon = any; // Placeholder

import { ICouponRepository } from "@/ports/repositories";
import { IStripeAdapter } from "@/ports/stripe.adapter";
import { CreateCouponDto, CouponDto } from "@/application/dtos/coupon.dto";
import { CouponDtoMapper } from "@/application/mappers/coupon-dto.mapper";
import { CouponError } from "@/application/errors/payment.errors";

/**
 * Create Coupon Use Case
 */
export class CreateCouponUseCase {
  constructor(
    private readonly couponRepository: ICouponRepository,
    private readonly stripeAdapter: IStripeAdapter
  ) {}

  async execute(
    input: CreateCouponDto,
    requestUserCommunityId: string
  ): Promise<CouponDto> {
    try {
      // Verify community ownership
      if (input.communityId !== requestUserCommunityId) {
        throw new Error(CouponError.UNAUTHORIZED);
      }

      // Validate input
      if (!input.code || input.code.trim().length === 0) {
        throw new Error(CouponError.INVALID_CODE);
      }

      if (
        input.discountType !== "PERCENTAGE" &&
        input.discountType !== "FIXED_AMOUNT"
      ) {
        throw new Error(CouponError.INVALID_INPUT);
      }

      if (input.discountValue <= 0) {
        throw new Error(CouponError.INVALID_INPUT);
      }

      if (input.discountType === "PERCENTAGE" && input.discountValue > 100) {
        throw new Error(CouponError.INVALID_INPUT);
      }

      // Check if code already exists for this community
      const normalizedCode = input.code.toUpperCase();
      const existingCoupon =
        await this.couponRepository.findByCodeAndCommunity(
          normalizedCode,
          input.communityId
        );

      if (existingCoupon) {
        throw new Error(CouponError.INVALID_CODE);
      }

      // Create Stripe coupon
      let stripeCouponId: string;
      try {
        const stripeResult = await this.stripeAdapter.createCoupon(
          normalizedCode,
          input.discountType,
          input.discountValue,
          input.expiresAt ? new Date(input.expiresAt) : null
        );
        stripeCouponId = stripeResult.couponId;
      } catch (error) {
        throw new Error(CouponError.STRIPE_ERROR);
      }

      // Create domain entity
      const id = crypto.randomUUID();
      const couponProps = CouponDtoMapper.fromCreateDto(input, id);

      // TODO: Replace with actual Coupon.create() call
      const coupon = {
        ...couponProps,
        stripeCouponId,
        getId: () => id,
        getCommunityId: () => input.communityId,
        getCode: () => normalizedCode,
        getDiscountType: () => input.discountType,
        getDiscountValue: () => input.discountValue,
        getExpiresAt: () => (input.expiresAt ? new Date(input.expiresAt) : null),
        getMaxUses: () => input.maxUses ?? null,
        getUsedCount: () => 0,
        getIsActive: () => true,
        isAvailable: () => true,
        getStripeCouponId: () => stripeCouponId,
        getCreatedAt: () => new Date(),
        getUpdatedAt: () => new Date(),
      } as any;

      // Persist via repository
      const savedCoupon = await this.couponRepository.create(coupon);

      // Return DTO
      return CouponDtoMapper.toDto(savedCoupon);
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
