/**
 * Stripe Adapter Port
 * Interface for Stripe payment integration
 * Infrastructure implementations must satisfy this contract
 */

/**
 * Stripe Product Creation Result
 */
export interface StripeProductResult {
  productId: string;
  priceMonthlyId: string;
  priceAnnualId: string;
}

/**
 * Stripe Checkout Session Result
 */
export interface StripeCheckoutSessionResult {
  sessionId: string;
  checkoutUrl: string;
}

/**
 * Stripe Coupon Creation Result
 */
export interface StripeCouponResult {
  couponId: string;
}

/**
 * Stripe Adapter Interface
 * Defines contract for Stripe integration
 */
export interface IStripeAdapter {
  /**
   * Create Stripe product with monthly and annual prices
   * @param name Product name
   * @param description Product description
   * @param priceMonthly Monthly price in cents
   * @param priceAnnual Annual price in cents
   * @returns Product ID and price IDs
   */
  createProduct(
    name: string,
    description: string,
    priceMonthly: number,
    priceAnnual: number
  ): Promise<StripeProductResult>;

  /**
   * Update Stripe product
   * @param productId Stripe product ID
   * @param name Updated product name
   * @param description Updated product description
   * @returns Updated product ID
   */
  updateProduct(
    productId: string,
    name: string,
    description: string
  ): Promise<string>;

  /**
   * Create Stripe coupon
   * @param code Coupon code
   * @param discountType PERCENTAGE or FIXED_AMOUNT
   * @param discountValue Percentage (0-100) or amount in cents
   * @param expiresAt Optional expiration date
   * @returns Stripe coupon ID
   */
  createCoupon(
    code: string,
    discountType: string,
    discountValue: number,
    expiresAt?: Date | null
  ): Promise<StripeCouponResult>;

  /**
   * Create Stripe checkout session
   * @param priceId Stripe price ID
   * @param customerId Optional existing Stripe customer ID
   * @param trialDays Number of trial days (V1: always 7)
   * @param couponId Optional Stripe coupon ID
   * @param successUrl Success redirect URL
   * @param cancelUrl Cancel redirect URL
   * @param metadata Additional metadata to attach
   * @returns Checkout session ID and URL
   */
  createCheckoutSession(params: {
    priceId: string;
    customerId?: string;
    trialDays: number;
    couponId?: string;
    successUrl: string;
    cancelUrl: string;
    metadata: Record<string, string>;
  }): Promise<StripeCheckoutSessionResult>;

  /**
   * Cancel Stripe subscription at period end
   * @param subscriptionId Stripe subscription ID
   * @returns Updated subscription ID
   */
  cancelSubscription(subscriptionId: string): Promise<string>;

  /**
   * Retrieve Stripe subscription details
   * @param subscriptionId Stripe subscription ID
   * @returns Subscription details
   */
  getSubscription(subscriptionId: string): Promise<{
    id: string;
    status: string;
    customerId: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    trialEnd: Date | null;
  }>;

  /**
   * Construct webhook event from raw request
   * @param rawBody Raw request body
   * @param signature Stripe signature header
   * @returns Parsed webhook event
   */
  constructWebhookEvent(
    rawBody: string | Buffer,
    signature: string
  ): Promise<{
    type: string;
    data: any;
  }>;
}
