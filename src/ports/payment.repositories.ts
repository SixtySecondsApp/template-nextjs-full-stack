/**
 * Payment Repository Interfaces (Ports)
 * Define contracts for payment-related persistence operations
 * Using domain entities, NOT DTOs or Prisma types
 */

// Import domain entities (assuming these exist from Phase 6 Domain)
// If these don't exist yet, they need to be created first
// Placeholder types for now - replace with actual domain entities
type PaymentTier = any; // TODO: Import from @/domain/payment-tier/payment-tier.entity
type Subscription = any; // TODO: Import from @/domain/subscription/subscription.entity
type Coupon = any; // TODO: Import from @/domain/coupon/coupon.entity

/**
 * Payment Tier Repository Interface
 * Defines persistence operations for PaymentTier aggregate
 */
export interface IPaymentTierRepository {
  /**
   * Create a new payment tier
   */
  create(tier: PaymentTier): Promise<PaymentTier>;

  /**
   * Update an existing payment tier
   */
  update(tier: PaymentTier): Promise<PaymentTier>;

  /**
   * Archive (soft delete) a payment tier
   */
  archive(id: string): Promise<void>;

  /**
   * Restore an archived payment tier
   */
  restore(id: string): Promise<void>;

  /**
   * Permanently delete a payment tier (use sparingly)
   */
  delete(id: string): Promise<void>;

  /**
   * Find payment tier by ID (excludes archived by default)
   */
  findById(id: string): Promise<PaymentTier | null>;

  /**
   * Find all payment tiers for a community (excludes archived by default)
   * @param communityId Community ID
   * @param includeInactive Optional flag to include inactive tiers
   */
  findByCommunityId(
    communityId: string,
    includeInactive?: boolean
  ): Promise<PaymentTier[]>;

  /**
   * Count active payment tiers for a community
   * Used for V1 constraint: max 2 tiers (1 free + 1 paid)
   */
  countByCommunityId(communityId: string): Promise<number>;

  /**
   * Find free tier for a community
   */
  findFreeTier(communityId: string): Promise<PaymentTier | null>;

  /**
   * Find all payment tiers (includes archived, admin only)
   */
  findAll(): Promise<PaymentTier[]>;
}

/**
 * Subscription Repository Interface
 * Defines persistence operations for Subscription aggregate
 */
export interface ISubscriptionRepository {
  /**
   * Create a new subscription
   */
  create(subscription: Subscription): Promise<Subscription>;

  /**
   * Update an existing subscription
   */
  update(subscription: Subscription): Promise<Subscription>;

  /**
   * Archive (soft delete) a subscription
   */
  archive(id: string): Promise<void>;

  /**
   * Restore an archived subscription
   */
  restore(id: string): Promise<void>;

  /**
   * Permanently delete a subscription (use sparingly)
   */
  delete(id: string): Promise<void>;

  /**
   * Find subscription by ID (excludes archived by default)
   */
  findById(id: string): Promise<Subscription | null>;

  /**
   * Find active subscription for user in community
   * Returns null if no active subscription
   */
  findByUserAndCommunity(
    userId: string,
    communityId: string
  ): Promise<Subscription | null>;

  /**
   * Find subscription by Stripe subscription ID
   * Used for webhook processing
   */
  findByStripeSubscriptionId(
    stripeSubscriptionId: string
  ): Promise<Subscription | null>;

  /**
   * Find all subscriptions for a user (excludes archived by default)
   */
  findByUserId(userId: string): Promise<Subscription[]>;

  /**
   * Find all subscriptions for a community (excludes archived by default)
   * @param communityId Community ID
   * @param includeInactive Optional flag to include cancelled/expired subscriptions
   */
  findByCommunityId(
    communityId: string,
    includeInactive?: boolean
  ): Promise<Subscription[]>;

  /**
   * Find all subscriptions for a payment tier
   * Used for analytics and tier management
   */
  findByPaymentTierId(paymentTierId: string): Promise<Subscription[]>;

  /**
   * Count active subscriptions for a community
   * Used for analytics
   */
  countActiveByCommunityId(communityId: string): Promise<number>;

  /**
   * Find all subscriptions (includes archived, admin only)
   */
  findAll(): Promise<Subscription[]>;
}

/**
 * Coupon Repository Interface
 * Defines persistence operations for Coupon aggregate
 */
export interface ICouponRepository {
  /**
   * Create a new coupon
   */
  create(coupon: Coupon): Promise<Coupon>;

  /**
   * Update an existing coupon
   */
  update(coupon: Coupon): Promise<Coupon>;

  /**
   * Archive (soft delete) a coupon
   */
  archive(id: string): Promise<void>;

  /**
   * Restore an archived coupon
   */
  restore(id: string): Promise<void>;

  /**
   * Permanently delete a coupon (use sparingly)
   */
  delete(id: string): Promise<void>;

  /**
   * Find coupon by ID (excludes archived by default)
   */
  findById(id: string): Promise<Coupon | null>;

  /**
   * Find coupon by code and community
   * Used for coupon application during checkout
   */
  findByCodeAndCommunity(
    code: string,
    communityId: string
  ): Promise<Coupon | null>;

  /**
   * Find all coupons for a community (excludes archived by default)
   * @param communityId Community ID
   * @param includeInactive Optional flag to include inactive/expired coupons
   */
  findByCommunityId(
    communityId: string,
    includeInactive?: boolean
  ): Promise<Coupon[]>;

  /**
   * Find all coupons (includes archived, admin only)
   */
  findAll(): Promise<Coupon[]>;
}
