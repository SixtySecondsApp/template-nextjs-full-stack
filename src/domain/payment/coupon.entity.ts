import {
  DiscountType,
  CreateCouponInput,
  CouponData,
} from "./coupon.types";

/**
 * Coupon entity represents a discount coupon for payment tiers.
 * Follows hexagonal architecture with pure domain logic - NO framework dependencies.
 *
 * Business Rules:
 * - Code: uppercase, 4-20 alphanumeric characters
 * - Percentage discount: 0-100
 * - Fixed amount discount: >= 0 (in cents)
 * - Cannot use expired or inactive coupon
 * - Cannot use if maxUses reached
 * - Cannot modify archived coupons
 */
export class Coupon {
  private constructor(
    private readonly id: string,
    private readonly communityId: string,
    private code: string,
    private readonly discountType: DiscountType,
    private readonly discountValue: number,
    private expiresAt: Date | null,
    private maxUses: number | null,
    private usedCount: number,
    private isActive: boolean,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private deletedAt: Date | null = null
  ) {
    this.validateCode(code);
    this.validateDiscount(discountType, discountValue);
  }

  /**
   * Factory method to create a new Coupon entity.
   * Coupon starts as active with 0 uses.
   */
  static create(input: CreateCouponInput): Coupon {
    return new Coupon(
      input.id,
      input.communityId,
      input.code.toUpperCase(), // Ensure uppercase
      input.discountType,
      input.discountValue,
      input.expiresAt ?? null,
      input.maxUses ?? null,
      0, // usedCount
      true, // isActive
      new Date(),
      new Date(),
      null // deletedAt
    );
  }

  /**
   * Factory method to reconstitute a Coupon entity from persistence.
   */
  static reconstitute(data: CouponData): Coupon {
    return new Coupon(
      data.id,
      data.communityId,
      data.code,
      data.discountType,
      data.discountValue,
      data.expiresAt,
      data.maxUses,
      data.usedCount,
      data.isActive,
      data.createdAt,
      data.updatedAt,
      data.deletedAt
    );
  }

  // Getters

  getId(): string {
    return this.id;
  }

  getCommunityId(): string {
    return this.communityId;
  }

  getCode(): string {
    return this.code;
  }

  getDiscountType(): DiscountType {
    return this.discountType;
  }

  getDiscountValue(): number {
    return this.discountValue;
  }

  getExpiresAt(): Date | null {
    return this.expiresAt;
  }

  getMaxUses(): number | null {
    return this.maxUses;
  }

  getUsedCount(): number {
    return this.usedCount;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getDeletedAt(): Date | null {
    return this.deletedAt;
  }

  isArchived(): boolean {
    return this.deletedAt !== null;
  }

  // Business logic methods

  /**
   * Use the coupon (increment usage count).
   * @throws Error if coupon is archived, inactive, expired, or max uses reached
   */
  use(): void {
    this.ensureNotArchived();

    if (!this.isActive) {
      throw new Error("Coupon is not active");
    }

    if (this.isExpired()) {
      throw new Error("Coupon has expired");
    }

    if (this.maxUses !== null && this.usedCount >= this.maxUses) {
      throw new Error("Coupon has reached maximum uses");
    }

    this.usedCount++;
    this.updatedAt = new Date();
  }

  /**
   * Activate the coupon.
   * @throws Error if coupon is archived
   */
  activate(): void {
    this.ensureNotArchived();

    if (this.isActive) {
      throw new Error("Coupon is already active");
    }

    this.isActive = true;
    this.updatedAt = new Date();
  }

  /**
   * Deactivate the coupon.
   * @throws Error if coupon is archived
   */
  deactivate(): void {
    this.ensureNotArchived();

    if (!this.isActive) {
      throw new Error("Coupon is already inactive");
    }

    this.isActive = false;
    this.updatedAt = new Date();
  }

  /**
   * Check if coupon has expired.
   */
  isExpired(): boolean {
    if (this.expiresAt === null) {
      return false;
    }
    return new Date() > this.expiresAt;
  }

  /**
   * Check if coupon is available for use.
   * Checks: active, not expired, not max uses reached.
   */
  isAvailable(): boolean {
    if (!this.isActive || this.isArchived()) {
      return false;
    }

    if (this.isExpired()) {
      return false;
    }

    if (this.maxUses !== null && this.usedCount >= this.maxUses) {
      return false;
    }

    return true;
  }

  /**
   * Calculate the discounted amount for a given price.
   * @param price - Original price in cents
   * @returns Discounted amount in cents
   * @throws Error if coupon is not available
   */
  calculateDiscount(price: number): number {
    if (!this.isAvailable()) {
      throw new Error("Coupon is not available");
    }

    if (price < 0) {
      throw new Error("Price cannot be negative");
    }

    if (this.discountType === DiscountType.PERCENTAGE) {
      const discountAmount = Math.floor((price * this.discountValue) / 100);
      return Math.max(0, price - discountAmount);
    } else {
      // FIXED_AMOUNT
      return Math.max(0, price - this.discountValue);
    }
  }

  /**
   * Archive (soft delete) the coupon.
   * @throws Error if coupon is already archived or is active
   */
  archive(): void {
    if (this.isArchived()) {
      throw new Error("Coupon is already archived");
    }

    if (this.isActive) {
      throw new Error("Cannot archive active coupon. Deactivate first");
    }

    this.deletedAt = new Date();
  }

  /**
   * Restore coupon from archived state.
   * @throws Error if coupon is not archived
   */
  restore(): void {
    if (!this.isArchived()) {
      throw new Error("Coupon is not archived");
    }

    this.deletedAt = null;
    this.updatedAt = new Date();
  }

  // Private validation methods

  private validateCode(code: string): void {
    if (!code || code.trim().length === 0) {
      throw new Error("Coupon code is required");
    }

    const trimmedCode = code.trim();

    if (trimmedCode.length < 4) {
      throw new Error("Coupon code must be at least 4 characters");
    }

    if (trimmedCode.length > 20) {
      throw new Error("Coupon code must not exceed 20 characters");
    }

    // Must be alphanumeric and uppercase
    if (!/^[A-Z0-9]+$/.test(trimmedCode)) {
      throw new Error("Coupon code must be uppercase alphanumeric characters only");
    }
  }

  private validateDiscount(type: DiscountType, value: number): void {
    if (value < 0) {
      throw new Error("Discount value cannot be negative");
    }

    if (!Number.isInteger(value)) {
      throw new Error("Discount value must be an integer");
    }

    if (type === DiscountType.PERCENTAGE) {
      if (value > 100) {
        throw new Error("Percentage discount cannot exceed 100");
      }
    }
  }

  private ensureNotArchived(): void {
    if (this.isArchived()) {
      throw new Error("Cannot modify archived coupon");
    }
  }
}
