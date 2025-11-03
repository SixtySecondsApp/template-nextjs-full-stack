/**
 * Subscription DTOs
 * Data Transfer Objects for subscription operations
 * All dates as ISO strings for JSON serialization
 */

/**
 * Subscription DTO
 * Represents a subscription in API responses
 */
export interface SubscriptionDto {
  id: string;
  userId: string;
  communityId: string;
  paymentTierId: string;
  paymentTierName: string; // Enriched from PaymentTier
  status: string; // ACTIVE, CANCELLED, PAST_DUE, TRIALING
  interval: string; // MONTHLY, ANNUAL
  currentPeriodStart: string; // ISO string
  currentPeriodEnd: string; // ISO string
  cancelAtPeriodEnd: boolean;
  trialEndsAt: string | null; // ISO string
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  isActive: boolean; // Computed: status === ACTIVE or TRIALING
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

/**
 * Create Subscription DTO
 * Input for creating a new subscription (checkout initiation)
 */
export interface CreateSubscriptionDto {
  userId: string;
  communityId: string;
  paymentTierId: string;
  interval: string; // MONTHLY, ANNUAL
  couponCode?: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Create Checkout Session Response DTO
 * Output from subscription creation (checkout URL)
 */
export interface CreateCheckoutSessionResponseDto {
  checkoutUrl: string;
  subscriptionId: string; // Pending subscription ID
  sessionId: string; // Stripe checkout session ID
}

/**
 * Subscription Status DTO
 * Simplified subscription status for UI
 */
export interface SubscriptionStatusDto {
  hasActiveSubscription: boolean;
  status: string | null;
  tierName: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}
