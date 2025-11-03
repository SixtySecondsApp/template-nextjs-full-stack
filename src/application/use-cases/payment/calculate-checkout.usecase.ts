/**
 * Calculate Checkout Use Case
 * Calculates checkout pricing with coupon discounts
 */

import { IPaymentTierRepository, ICouponRepository } from "@/ports/repositories";
import {
  CalculateCheckoutDto,
  CheckoutCalculationDto,
} from "@/application/dtos/checkout.dto";
import { CouponDtoMapper } from "@/application/mappers/coupon-dto.mapper";
import { CheckoutError } from "@/application/errors/payment.errors";

/**
 * Calculate Checkout Use Case
 * Returns calculated pricing for checkout preview
 */
export class CalculateCheckoutUseCase {
  constructor(
    private readonly paymentTierRepository: IPaymentTierRepository,
    private readonly couponRepository: ICouponRepository
  ) {}

  async execute(input: CalculateCheckoutDto): Promise<CheckoutCalculationDto> {
    try {
      // Validate input
      if (!input.paymentTierId || !input.interval) {
        throw new Error(CheckoutError.INVALID_INPUT);
      }

      if (input.interval !== "MONTHLY" && input.interval !== "ANNUAL") {
        throw new Error(CheckoutError.INVALID_INPUT);
      }

      // Get payment tier
      const tier = await this.paymentTierRepository.findById(
        input.paymentTierId
      );

      if (!tier) {
        throw new Error(CheckoutError.TIER_NOT_FOUND);
      }

      if (!tier.getIsActive()) {
        throw new Error(CheckoutError.TIER_NOT_ACTIVE);
      }

      // Calculate base price (subtotal)
      const subtotal =
        input.interval === "MONTHLY"
          ? tier.getPriceMonthly()
          : tier.getPriceAnnual();

      // Initialize discount
      let discount = 0;
      let couponApplied = false;
      let couponCode: string | null = null;

      // Apply coupon if provided
      if (input.couponCode) {
        try {
          // Normalize code
          const normalizedCode = input.couponCode.toUpperCase().trim();

          // Find and validate coupon
          const coupon = await this.couponRepository.findByCodeAndCommunity(
            normalizedCode,
            tier.getCommunityId()
          );

          if (!coupon) {
            throw new Error(CheckoutError.COUPON_NOT_FOUND);
          }

          // Check if coupon is available
          if (!coupon.isAvailable()) {
            throw new Error(CheckoutError.COUPON_INVALID);
          }

          // Calculate discount using mapper
          const appliedCoupon = CouponDtoMapper.toAppliedDto(coupon, subtotal);
          discount = appliedCoupon.discountAmount;
          couponApplied = true;
          couponCode = normalizedCode;
        } catch (error) {
          // If coupon validation fails, continue without discount
          // Error will be in the thrown exception
          if (error instanceof Error) {
            if (
              error.message === CheckoutError.COUPON_NOT_FOUND ||
              error.message === CheckoutError.COUPON_INVALID
            ) {
              throw error;
            }
          }
        }
      }

      // Calculate total
      const total = Math.max(0, subtotal - discount);

      // Return calculation
      return {
        subtotal,
        discount,
        total,
        couponApplied,
        couponCode,
        trialDays: 7, // V1: Always 7-day trial
        interval: input.interval,
        tierName: tier.getName(),
      };
    } catch (error) {
      if (error instanceof Error) {
        // Re-throw known application errors
        if (
          Object.values(CheckoutError).includes(
            error.message as CheckoutError
          )
        ) {
          throw error;
        }
      }

      // Unknown error
      throw new Error(CheckoutError.INTERNAL_SERVER_ERROR);
    }
  }
}
