/**
 * Payment Service
 * High-level orchestration for payment operations
 * Coordinates between Stripe adapter and domain logic
 */

import {
  IStripeAdapter,
  CreateCheckoutSessionInput,
  CreateCustomerInput,
} from "./stripe.port";

/**
 * Input for initiating subscription checkout
 * Application-level abstraction over Stripe checkout session
 */
export interface InitiateSubscriptionCheckoutInput {
  /**
   * User email address
   */
  userEmail: string;

  /**
   * User full name
   */
  userName: string;

  /**
   * Stripe price ID from PaymentTier
   * Should be fetched from PaymentTier entity based on tier selection
   */
  stripePriceId: string;

  /**
   * Billing interval (monthly or annual)
   */
  interval: "month" | "year";

  /**
   * Optional coupon code to apply
   */
  couponCode?: string;

  /**
   * URL to redirect to after successful payment
   */
  successUrl: string;

  /**
   * URL to redirect to if checkout is cancelled
   */
  cancelUrl: string;

  /**
   * Optional existing Stripe customer ID
   */
  existingCustomerId?: string;

  /**
   * Metadata to attach to the subscription
   * Should include communityId, paymentTierId, userId for tracking
   */
  metadata?: Record<string, string>;

  /**
   * Number of trial days (default: 7 for V1)
   */
  trialDays?: number;
}

/**
 * Payment Service
 * Orchestrates payment operations using Stripe adapter
 * No business logic - only coordination between infrastructure components
 */
export class PaymentService {
  constructor(private stripeAdapter: IStripeAdapter) {}

  /**
   * Initiate subscription checkout flow
   * Creates Stripe customer if needed and returns checkout URL
   *
   * @param input Checkout configuration
   * @returns Stripe checkout URL to redirect customer to
   */
  async initiateSubscriptionCheckout(
    input: InitiateSubscriptionCheckoutInput
  ): Promise<string> {
    // Step 1: Determine customer ID
    // If no existing customer ID, create a new Stripe customer
    let customerId = input.existingCustomerId;

    if (!customerId) {
      const customerInput: CreateCustomerInput = {
        email: input.userEmail,
        name: input.userName,
        metadata: {
          source: "sixty-community",
          ...input.metadata,
        },
      };

      const customer = await this.stripeAdapter.createCustomer(customerInput);
      customerId = customer.id;
    }

    // Step 2: Prepare checkout session configuration
    const checkoutInput: CreateCheckoutSessionInput = {
      priceId: input.stripePriceId,
      customerId: customerId,
      customerEmail: input.userEmail,
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl,
      trialDays: input.trialDays ?? 7, // Default to 7-day trial for V1
      couponId: input.couponCode, // Stripe will validate if coupon exists
      metadata: {
        interval: input.interval,
        ...input.metadata,
      },
    };

    // Step 3: Create checkout session and return URL
    const checkoutUrl =
      await this.stripeAdapter.createCheckoutSession(checkoutInput);

    return checkoutUrl;
  }

  /**
   * Create a Stripe customer
   * Wrapper around adapter for consistency
   */
  async createCustomer(input: CreateCustomerInput) {
    return await this.stripeAdapter.createCustomer(input);
  }

  /**
   * Get customer details from Stripe
   * Used to retrieve customer information before checkout
   */
  async getCustomer(customerId: string) {
    return await this.stripeAdapter.getCustomer(customerId);
  }

  /**
   * Get subscription details from Stripe
   * Used to check subscription status in webhook handlers
   */
  async getSubscription(subscriptionId: string) {
    return await this.stripeAdapter.getSubscription(subscriptionId);
  }

  /**
   * Cancel a subscription
   * @param subscriptionId Stripe subscription ID
   * @param cancelImmediately If true, cancel now; if false, cancel at period end
   */
  async cancelSubscription(
    subscriptionId: string,
    cancelImmediately: boolean = false
  ) {
    await this.stripeAdapter.cancelSubscription(
      subscriptionId,
      cancelImmediately
    );
  }

  /**
   * Create a Stripe product for a PaymentTier
   * Used during PaymentTier setup
   */
  async createProduct(name: string, description: string) {
    return await this.stripeAdapter.createProduct(name, description);
  }

  /**
   * Create a Stripe price for a product
   * Used during PaymentTier setup to create monthly/annual pricing
   */
  async createPrice(input: {
    productId: string;
    amount: number;
    currency: string;
    interval: "month" | "year";
  }) {
    return await this.stripeAdapter.createPrice(input);
  }

  /**
   * Create a promotional coupon
   * Used by admin to create discount codes
   */
  async createCoupon(
    code: string,
    percentOff?: number,
    amountOff?: number
  ) {
    return await this.stripeAdapter.createCoupon(code, percentOff, amountOff);
  }

  /**
   * Verify and construct webhook event
   * CRITICAL: Always use this method to process webhooks
   * Never trust webhook payloads without signature verification
   */
  async verifyWebhookEvent(payload: string, signature: string) {
    return await this.stripeAdapter.constructWebhookEvent(payload, signature);
  }
}
