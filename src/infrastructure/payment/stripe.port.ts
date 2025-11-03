/**
 * Stripe Adapter Port Interface
 * Defines the contract for Stripe SDK integration
 * Infrastructure layer interface for payment processing
 */

/**
 * Input for creating a Stripe checkout session
 */
export interface CreateCheckoutSessionInput {
  /**
   * Stripe price ID associated with the payment tier
   */
  priceId: string;

  /**
   * Existing Stripe customer ID (optional)
   * If not provided, customer will be created from email
   */
  customerId?: string;

  /**
   * Customer email address
   * Used for customer creation if customerId not provided
   */
  customerEmail: string;

  /**
   * URL to redirect to after successful payment
   */
  successUrl: string;

  /**
   * URL to redirect to if checkout is cancelled
   */
  cancelUrl: string;

  /**
   * Number of trial days (default: 7 for V1)
   * Set to 0 for no trial
   */
  trialDays?: number;

  /**
   * Stripe coupon ID to apply to the subscription
   */
  couponId?: string;

  /**
   * Additional metadata to attach to the subscription
   * Useful for tracking community ID, payment tier ID, etc.
   */
  metadata?: Record<string, string>;
}

/**
 * Input for creating a Stripe customer
 */
export interface CreateCustomerInput {
  /**
   * Customer email address
   */
  email: string;

  /**
   * Customer full name
   */
  name: string;

  /**
   * Additional metadata to attach to the customer
   */
  metadata?: Record<string, string>;
}

/**
 * Input for creating a Stripe price
 */
export interface CreatePriceInput {
  /**
   * Stripe product ID
   */
  productId: string;

  /**
   * Price amount in cents (e.g., 2900 for £29.00)
   */
  amount: number;

  /**
   * Currency code (e.g., 'usd', 'gbp')
   */
  currency: string;

  /**
   * Billing interval
   */
  interval: "month" | "year";
}

/**
 * Stripe customer response
 */
export interface StripeCustomer {
  /**
   * Stripe customer ID
   */
  id: string;

  /**
   * Customer email address
   */
  email: string;
}

/**
 * Stripe product response
 */
export interface StripeProduct {
  /**
   * Stripe product ID
   */
  id: string;
}

/**
 * Stripe price response
 */
export interface StripePrice {
  /**
   * Stripe price ID
   */
  id: string;
}

/**
 * Stripe coupon response
 */
export interface StripeCoupon {
  /**
   * Stripe coupon ID
   */
  id: string;
}

/**
 * Stripe Adapter Port
 * Defines all operations for interacting with Stripe API
 * Infrastructure implementations must satisfy this interface
 */
export interface IStripeAdapter {
  /**
   * Create a Stripe Checkout session for subscription
   * @param input Checkout session configuration
   * @returns Checkout URL to redirect customer to
   */
  createCheckoutSession(input: CreateCheckoutSessionInput): Promise<string>;

  /**
   * Create a new Stripe customer
   * @param input Customer details
   * @returns Created customer data
   */
  createCustomer(input: CreateCustomerInput): Promise<StripeCustomer>;

  /**
   * Retrieve an existing Stripe customer
   * @param customerId Stripe customer ID
   * @returns Customer data
   */
  getCustomer(customerId: string): Promise<any>;

  /**
   * Retrieve a Stripe subscription
   * @param subscriptionId Stripe subscription ID
   * @returns Subscription data
   */
  getSubscription(subscriptionId: string): Promise<any>;

  /**
   * Cancel a Stripe subscription
   * @param subscriptionId Stripe subscription ID
   * @param cancelImmediately If true, cancel immediately; if false, cancel at period end
   */
  cancelSubscription(
    subscriptionId: string,
    cancelImmediately: boolean
  ): Promise<void>;

  /**
   * Create a Stripe product
   * @param name Product name
   * @param description Product description
   * @returns Created product data
   */
  createProduct(name: string, description: string): Promise<StripeProduct>;

  /**
   * Create a Stripe price for a product
   * @param input Price configuration
   * @returns Created price data
   */
  createPrice(input: CreatePriceInput): Promise<StripePrice>;

  /**
   * Create a Stripe coupon
   * @param code Coupon code
   * @param percentOff Percentage discount (e.g., 20 for 20% off)
   * @param amountOff Fixed amount discount in cents
   * @returns Created coupon data
   */
  createCoupon(
    code: string,
    percentOff?: number,
    amountOff?: number
  ): Promise<StripeCoupon>;

  /**
   * Construct and verify a Stripe webhook event
   * @param payload Raw webhook payload body
   * @param signature Stripe signature header
   * @returns Verified webhook event object
   */
  constructWebhookEvent(payload: string, signature: string): Promise<any>;
}
