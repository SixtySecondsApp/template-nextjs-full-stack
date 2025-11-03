# Payment Infrastructure - Stripe SDK Integration

Phase 6.5 Infrastructure implementation for Stripe payment processing.

## Architecture

Follows Hexagonal Architecture pattern with clean separation of concerns:

```
stripe.port.ts      → Port interface (contract)
stripe.adapter.ts   → Adapter implementation (Stripe SDK wrapper)
payment.service.ts  → Service orchestrator (high-level coordination)
```

## Files Created

### 1. `stripe.port.ts`
**Port interface defining the contract for Stripe integration**

Key interfaces:
- `IStripeAdapter` - Main port interface with all Stripe operations
- `CreateCheckoutSessionInput` - Checkout session configuration
- `CreateCustomerInput` - Customer creation details
- `CreatePriceInput` - Price configuration for products
- Response types: `StripeCustomer`, `StripeProduct`, `StripePrice`, `StripeCoupon`

### 2. `stripe.adapter.ts`
**Concrete implementation of IStripeAdapter using Stripe SDK**

Key features:
- Stripe API version: `2025-10-29.clover` (latest)
- Environment variable validation
- Error handling with Stripe-specific error types
- Webhook signature verification
- Type-safe Stripe SDK usage

Methods implemented:
- `createCheckoutSession()` - Create subscription checkout URL
- `createCustomer()` - Create new Stripe customer
- `getCustomer()` - Retrieve customer details
- `getSubscription()` - Retrieve subscription details
- `cancelSubscription()` - Cancel subscription (immediate or at period end)
- `createProduct()` - Create Stripe product
- `createPrice()` - Create Stripe price for product
- `createCoupon()` - Create discount coupon
- `constructWebhookEvent()` - Verify and parse webhook events

### 3. `payment.service.ts`
**High-level orchestration service for payment operations**

Key features:
- Application-level abstraction over Stripe operations
- Customer management coordination
- Checkout flow orchestration
- 7-day trial period support (V1 requirement)
- Metadata tracking for subscriptions

Main method:
- `initiateSubscriptionCheckout()` - Orchestrates full checkout flow:
  1. Create Stripe customer if needed
  2. Configure checkout session with trial period
  3. Apply coupon if provided
  4. Return checkout URL

### 4. `index.ts`
**Barrel export for clean imports**

Exports all public interfaces and implementations.

## Environment Variables Required

```bash
# Stripe API Keys (already configured in .env)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Usage Example

```typescript
import { StripeAdapter, PaymentService } from "@/infrastructure/payment";

// Initialize
const stripeAdapter = new StripeAdapter();
const paymentService = new PaymentService(stripeAdapter);

// Initiate subscription checkout
const checkoutUrl = await paymentService.initiateSubscriptionCheckout({
  userEmail: "user@example.com",
  userName: "John Doe",
  stripePriceId: "price_xxx", // From PaymentTier entity
  interval: "month",
  successUrl: "https://example.com/success",
  cancelUrl: "https://example.com/cancel",
  trialDays: 7, // V1: 7-day trial
  metadata: {
    communityId: "comm_xxx",
    paymentTierId: "tier_xxx",
  },
});

// Redirect user to checkoutUrl
```

## Security Considerations

1. **Environment Variables**: Secret keys must be configured securely
2. **Webhook Verification**: Always verify webhook signatures using `constructWebhookEvent()`
3. **Error Handling**: All Stripe errors are caught and wrapped with descriptive messages
4. **Type Safety**: Full TypeScript support with Stripe SDK types

## Architecture Compliance

✅ Infrastructure layer implements port interface
✅ Clean separation between Stripe SDK and domain logic
✅ Error handling for Stripe API failures
✅ Webhook signature verification for security
✅ Environment-based configuration
✅ No business logic in adapter (orchestration only)

## Next Steps

Phase 6.6 onwards will implement:
- Application use cases for subscription management
- API routes for checkout initiation
- Webhook handlers for Stripe events
- Domain event publishing for subscription state changes

## Dependencies

- `stripe`: Official Stripe Node.js SDK (v17+)
- TypeScript: Full type safety with Stripe types
- Node.js: v18+ for Stripe SDK compatibility
