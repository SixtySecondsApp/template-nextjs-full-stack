/**
 * Subscription Status Enum
 * Represents the lifecycle states of a subscription
 */
export enum SubscriptionStatus {
  /** Active subscription with valid payment */
  ACTIVE = 'ACTIVE',

  /** Subscription in trial period (7 days) */
  TRIALING = 'TRIALING',

  /** Subscription cancelled but still active until period end */
  CANCELLED = 'CANCELLED',

  /** Payment failed, subscription at risk of cancellation */
  PAST_DUE = 'PAST_DUE',
}

/**
 * Billing Interval Enum
 * Represents subscription billing frequency
 */
export enum BillingInterval {
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
}
