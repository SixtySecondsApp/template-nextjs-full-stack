/**
 * Stripe Adapter Implementation
 * Infrastructure layer implementation of IStripeAdapter
 * Handles all direct communication with Stripe API
 */

import Stripe from "stripe";
import {
  IStripeAdapter,
  CreateCheckoutSessionInput,
  CreateCustomerInput,
  CreatePriceInput,
  StripeCustomer,
  StripeProduct,
  StripePrice,
  StripeCoupon,
} from "./stripe.port";

/**
 * Concrete implementation of Stripe API adapter
 * Encapsulates all Stripe SDK interactions
 */
export class StripeAdapter implements IStripeAdapter {
  private stripe: Stripe;
  private webhookSecret: string;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "STRIPE_SECRET_KEY not found in environment variables. Please configure Stripe credentials."
      );
    }

    // Initialize Stripe with latest API version
    this.stripe = new Stripe(secretKey, {
      apiVersion: "2025-10-29.clover",
      typescript: true,
    });

    // Webhook secret for signature verification
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  }

  /**
   * Create a Stripe Checkout session for subscription payment
   * Returns URL to redirect customer to Stripe-hosted checkout page
   */
  async createCheckoutSession(
    input: CreateCheckoutSessionInput
  ): Promise<string> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: "subscription",
        customer: input.customerId,
        customer_email: input.customerId ? undefined : input.customerEmail,
        line_items: [
          {
            price: input.priceId,
            quantity: 1,
          },
        ],
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        subscription_data: input.trialDays
          ? {
              trial_period_days: input.trialDays,
              metadata: input.metadata,
            }
          : { metadata: input.metadata },
        discounts: input.couponId ? [{ coupon: input.couponId }] : undefined,
        metadata: input.metadata,
        allow_promotion_codes: true, // Allow customers to enter promo codes
      });

      if (!session.url) {
        throw new Error(
          "Stripe checkout session created but no URL was returned"
        );
      }

      return session.url;
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new Error(`Stripe checkout session creation failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Create a new Stripe customer
   * Used when user first subscribes to a payment tier
   */
  async createCustomer(input: CreateCustomerInput): Promise<StripeCustomer> {
    try {
      const customer = await this.stripe.customers.create({
        email: input.email,
        name: input.name,
        metadata: input.metadata,
      });

      return {
        id: customer.id,
        email: customer.email!,
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new Error(`Stripe customer creation failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Retrieve an existing Stripe customer
   * Used to fetch customer details before creating checkout session
   */
  async getCustomer(customerId: string): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
    try {
      return await this.stripe.customers.retrieve(customerId);
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new Error(`Stripe customer retrieval failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Retrieve a Stripe subscription
   * Used to check subscription status and details
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new Error(`Stripe subscription retrieval failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Cancel a Stripe subscription
   * Supports both immediate cancellation and cancellation at period end
   */
  async cancelSubscription(
    subscriptionId: string,
    cancelImmediately: boolean
  ): Promise<void> {
    try {
      if (cancelImmediately) {
        // Cancel subscription immediately
        await this.stripe.subscriptions.cancel(subscriptionId);
      } else {
        // Cancel at end of current billing period
        await this.stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
      }
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new Error(`Stripe subscription cancellation failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Create a Stripe product
   * Used during PaymentTier setup to create corresponding Stripe product
   */
  async createProduct(
    name: string,
    description: string
  ): Promise<StripeProduct> {
    try {
      const product = await this.stripe.products.create({
        name,
        description,
      });

      return { id: product.id };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new Error(`Stripe product creation failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Create a Stripe price for a product
   * Used during PaymentTier setup to create monthly/annual pricing
   */
  async createPrice(input: CreatePriceInput): Promise<StripePrice> {
    try {
      const price = await this.stripe.prices.create({
        product: input.productId,
        unit_amount: input.amount,
        currency: input.currency,
        recurring: {
          interval: input.interval,
        },
      });

      return { id: price.id };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new Error(`Stripe price creation failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Create a Stripe coupon
   * Used to create discount codes for promotional campaigns
   */
  async createCoupon(
    code: string,
    percentOff?: number,
    amountOff?: number
  ): Promise<StripeCoupon> {
    try {
      if (!percentOff && !amountOff) {
        throw new Error(
          "Either percentOff or amountOff must be provided for coupon creation"
        );
      }

      const coupon = await this.stripe.coupons.create({
        id: code,
        percent_off: percentOff,
        amount_off: amountOff,
        currency: amountOff ? "usd" : undefined,
        duration: "forever", // V1: Simple forever discount
      });

      return { id: coupon.id };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new Error(`Stripe coupon creation failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Construct and verify a Stripe webhook event
   * CRITICAL: Always verify webhook signatures to prevent fake events
   */
  async constructWebhookEvent(
    payload: string,
    signature: string
  ): Promise<Stripe.Event> {
    try {
      if (!this.webhookSecret) {
        throw new Error(
          "STRIPE_WEBHOOK_SECRET not configured. Webhook signature verification is required."
        );
      }

      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret
      );
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new Error(`Stripe webhook verification failed: ${error.message}`);
      }
      throw error;
    }
  }
}
