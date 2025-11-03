/**
 * Coupon DTOs
 * Data Transfer Objects for coupon operations
 * All dates as ISO strings for JSON serialization
 */

/**
 * Coupon DTO
 * Represents a coupon in API responses
 */
export interface CouponDto {
  id: string;
  communityId: string;
  code: string;
  discountType: string; // PERCENTAGE, FIXED_AMOUNT
  discountValue: number; // Percentage (0-100) or cents for fixed amount
  expiresAt: string | null; // ISO string
  maxUses: number | null; // null = unlimited
  usedCount: number;
  isActive: boolean;
  isAvailable: boolean; // Computed: active and not expired and under max uses
  stripeCouponId: string | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

/**
 * Create Coupon DTO
 * Input for creating a new coupon
 */
export interface CreateCouponDto {
  communityId: string;
  code: string;
  discountType: string; // PERCENTAGE, FIXED_AMOUNT
  discountValue: number;
  expiresAt?: string | null; // ISO string
  maxUses?: number | null;
}

/**
 * Update Coupon DTO
 * Input for updating an existing coupon
 */
export interface UpdateCouponDto {
  isActive?: boolean;
  maxUses?: number | null;
  expiresAt?: string | null;
}

/**
 * Applied Coupon DTO
 * Response when applying a coupon (includes calculated discount)
 */
export interface AppliedCouponDto {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  discountAmount: number; // Calculated discount in cents
}
