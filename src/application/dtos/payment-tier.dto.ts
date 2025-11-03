/**
 * Payment Tier DTOs
 * Data Transfer Objects for payment tier operations
 * All dates as ISO strings for JSON serialization
 */

/**
 * Payment Tier DTO
 * Represents a payment tier in API responses
 */
export interface PaymentTierDto {
  id: string;
  communityId: string;
  name: string;
  description: string;
  priceMonthly: number; // Cents
  priceAnnual: number; // Cents
  features: string[];
  isActive: boolean;
  isFree: boolean;
  stripePriceMonthlyId: string | null;
  stripePriceAnnualId: string | null;
  stripeProductId: string | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

/**
 * Create Payment Tier DTO
 * Input for creating a new payment tier
 */
export interface CreatePaymentTierDto {
  communityId: string;
  name: string;
  description: string;
  priceMonthly: number; // Cents (0 for free tier)
  priceAnnual: number; // Cents (0 for free tier)
  features: string[];
}

/**
 * Update Payment Tier DTO
 * Input for updating an existing payment tier
 */
export interface UpdatePaymentTierDto {
  name?: string;
  description?: string;
  priceMonthly?: number; // Cents
  priceAnnual?: number; // Cents
  features?: string[];
  isActive?: boolean;
}
