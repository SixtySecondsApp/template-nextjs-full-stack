/**
 * Checkout DTOs
 * Data Transfer Objects for checkout operations
 */

/**
 * Checkout Calculation DTO
 * Response with calculated pricing for checkout
 */
export interface CheckoutCalculationDto {
  subtotal: number; // Cents
  discount: number; // Cents
  total: number; // Cents
  couponApplied: boolean;
  couponCode: string | null;
  trialDays: number; // V1: Always 7 days
  interval: string; // MONTHLY, ANNUAL
  tierName: string;
}

/**
 * Calculate Checkout Request DTO
 * Input for calculating checkout pricing
 */
export interface CalculateCheckoutDto {
  paymentTierId: string;
  interval: string; // MONTHLY, ANNUAL
  couponCode?: string;
}

/**
 * Create Checkout Session DTO
 * Input for creating a Stripe checkout session
 */
export interface CreateCheckoutSessionDto {
  paymentTierId: string;
  interval: string; // MONTHLY, ANNUAL
  couponCode?: string;
  successUrl: string;
  cancelUrl: string;
}
