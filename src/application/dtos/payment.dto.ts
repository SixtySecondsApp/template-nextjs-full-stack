/**
 * Payment DTOs for Sixty Community OS Monetization Feature (Phase 6)
 * V1 Scope: Free + 1 Paid tier, 7-day trial, content gating, Stripe integration
 */

export interface PaymentTierDto {
  id: string;
  name: string;
  description: string;
  priceMonthly: number; // in cents
  priceAnnual: number; // in cents
  features: string[];
  isFree: boolean;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionDto {
  id: string;
  userId: string;
  paymentTierId: string;
  paymentTier?: PaymentTierDto;
  status: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'TRIALING';
  interval: 'MONTHLY' | 'ANNUAL';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  createdAt: string;
  updatedAt: string;
  // Computed property
  isActive: boolean;
}

export interface CouponDto {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number; // percentage (1-100) or cents
  expiresAt: string | null;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutCalculationDto {
  paymentTierId: string;
  interval: 'MONTHLY' | 'ANNUAL';
  subtotal: number; // in cents
  discount: number; // in cents
  total: number; // in cents
  couponCode: string | null;
  hasTrialPeriod: boolean;
  trialDays: number;
}

export interface CheckoutSessionDto {
  sessionId: string;
  checkoutUrl: string;
}

export interface AnalyticsMetricsDto {
  totalMembers: number;
  freeMembers: number;
  paidMembers: number;
  memberGrowth: number; // percentage change month-over-month
  mrr: number; // Monthly Recurring Revenue in cents
  projectedAnnualRevenue: number; // MRR * 12
  mrrGrowth: number; // percentage change
  trialToPaidRate: number; // percentage
  freeToTrialRate: number; // percentage
  churnRate: number; // percentage
}

export interface RecentSubscriptionDto {
  id: string;
  userName: string;
  userEmail: string;
  planName: string;
  status: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'TRIALING';
  startDate: string;
  createdAt: string;
}

export interface BillingInvoiceDto {
  id: string;
  invoiceNumber: string;
  amount: number; // in cents
  status: 'PAID' | 'PENDING' | 'FAILED';
  invoiceUrl: string | null;
  invoicePdf: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface CustomerPortalDto {
  url: string;
}
