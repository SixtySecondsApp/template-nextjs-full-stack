# Stripe Webhook Setup Guide

Complete guide for configuring Stripe webhooks in local development and production environments.

## Overview

Stripe webhooks notify your application about subscription events (payments, cancellations, updates). This ensures your database stays in sync with Stripe's subscription state.

## Prerequisites

- Stripe account with API keys
- Stripe CLI (for local development)
- Environment variables configured

## Environment Variables

Add these to your `.env` file:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...           # Your Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_...      # Your Stripe publishable key
STRIPE_WEBHOOK_SECRET=whsec_...         # Webhook signing secret
```

---

## Local Development Setup

### Step 1: Install Stripe CLI

**macOS (using Homebrew):**
```bash
brew install stripe/stripe-cli/stripe
```

**Other platforms:**
Visit [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)

### Step 2: Login to Stripe

```bash
stripe login
```

This will open your browser to authenticate with your Stripe account.

### Step 3: Forward Webhooks to Local Server

Start your Next.js development server:
```bash
npm run dev
```

In a separate terminal, forward webhooks:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Step 4: Copy Webhook Signing Secret

The Stripe CLI will display a webhook signing secret:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

Copy this secret and add it to your `.env` file:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

Restart your Next.js server to load the new environment variable.

### Step 5: Test Webhook Events

Trigger test events using Stripe CLI:

```bash
# Test successful checkout
stripe trigger checkout.session.completed

# Test subscription update
stripe trigger customer.subscription.updated

# Test payment failure
stripe trigger invoice.payment_failed

# Test subscription deletion
stripe trigger customer.subscription.deleted
```

Monitor your terminal to see webhook processing logs.

---

## Production Setup

### Step 1: Deploy Your Application

Ensure your application is deployed and accessible at your production URL (e.g., `https://yourdomain.com`).

### Step 2: Configure Webhook Endpoint in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Enter your webhook URL:
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```

### Step 3: Select Events to Listen For

Select the following events:

- ✅ `checkout.session.completed` - User completes checkout
- ✅ `customer.subscription.updated` - Subscription changes
- ✅ `customer.subscription.deleted` - Subscription deleted
- ✅ `invoice.payment_succeeded` - Payment succeeds
- ✅ `invoice.payment_failed` - Payment fails

Click **Add endpoint** to save.

### Step 4: Copy Webhook Signing Secret

1. Click on your newly created webhook endpoint
2. In the **Signing secret** section, click **Reveal**
3. Copy the signing secret (starts with `whsec_`)
4. Add it to your production environment variables:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

### Step 5: Deploy with Environment Variable

Update your hosting provider (Vercel, Railway, etc.) with the new environment variable:

**Vercel:**
```bash
vercel env add STRIPE_WEBHOOK_SECRET production
# Paste the webhook secret when prompted
```

**Railway:**
```bash
railway variables --set STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

Redeploy your application to apply the changes.

---

## Webhook Event Flow

### 1. Checkout Completed (`checkout.session.completed`)

**When:** User successfully completes Stripe checkout

**What happens:**
- Subscription is created or updated in database
- User receives 7-day trial (V1 MVP)
- Subscription status set to `TRIALING`

**Metadata passed:**
- `userId`: User ID from your database
- `communityId`: Community ID
- `paymentTierId`: Payment tier ID
- `interval`: `MONTHLY` or `ANNUAL`

### 2. Subscription Updated (`customer.subscription.updated`)

**When:** Subscription status changes (active, cancelled, past due)

**What happens:**
- Subscription status updated in database
- Current period dates updated
- `cancelAtPeriodEnd` flag updated

### 3. Subscription Deleted (`customer.subscription.deleted`)

**When:** Subscription is permanently cancelled

**What happens:**
- Subscription soft deleted in database
- Status set to `CANCELLED`
- `deletedAt` timestamp set

### 4. Payment Succeeded (`invoice.payment_succeeded`)

**When:** Recurring payment succeeds

**What happens:**
- If subscription was `PAST_DUE`, reactivate it
- Subscription remains `ACTIVE`

### 5. Payment Failed (`invoice.payment_failed`)

**When:** Recurring payment fails

**What happens:**
- Subscription status set to `PAST_DUE`
- User notified of payment failure (TODO: Email notification)

---

## Testing Webhooks

### Test Successful Subscription Flow

1. **Trigger checkout completion:**
   ```bash
   stripe trigger checkout.session.completed
   ```

2. **Verify in logs:**
   ```
   [Webhook] Received event: checkout.session.completed
   [Webhook] Successfully processed checkout.session.completed
   ```

3. **Check database:**
   - Subscription record created
   - Status: `TRIALING`
   - Trial ends in 7 days

### Test Payment Failure

1. **Trigger payment failure:**
   ```bash
   stripe trigger invoice.payment_failed
   ```

2. **Verify in logs:**
   ```
   [Webhook] Received event: invoice.payment_failed
   [Webhook] Successfully processed invoice.payment_failed
   ```

3. **Check database:**
   - Subscription status: `PAST_DUE`

### Test Subscription Cancellation

1. **Trigger subscription deletion:**
   ```bash
   stripe trigger customer.subscription.deleted
   ```

2. **Verify in logs:**
   ```
   [Webhook] Received event: customer.subscription.deleted
   [Webhook] Successfully processed customer.subscription.deleted
   ```

3. **Check database:**
   - Subscription status: `CANCELLED`
   - `deletedAt` timestamp set

---

## Troubleshooting

### Webhook Signature Verification Failed

**Error:**
```
[Webhook] Signature verification failed
```

**Solutions:**
1. Verify `STRIPE_WEBHOOK_SECRET` is correct in `.env`
2. Ensure you're using the **raw body**, not parsed JSON
3. Check that secret matches the endpoint (test vs. production)

### Missing Stripe Signature Header

**Error:**
```
[Webhook] Missing Stripe signature header
```

**Solutions:**
1. Verify request is coming from Stripe CLI or Stripe servers
2. Check `stripe listen` is forwarding to correct port
3. Ensure you're not using a proxy that strips headers

### Subscription Not Found

**Error:**
```
[Webhook] Subscription not found: sub_xxxxx
```

**Possible causes:**
1. Subscription hasn't been created in database yet
2. Soft delete filter is excluding the subscription
3. Stripe subscription ID mismatch

**Solutions:**
1. Check checkout flow creates subscription correctly
2. Verify metadata is passed during checkout session creation
3. Check database for subscription record

### Webhook Processing Failed

**Error:**
```
[Webhook] Error processing checkout.session.completed
```

**Solutions:**
1. Check database connection is working
2. Verify all required fields are present in webhook event
3. Check application logs for detailed error messages
4. Ensure Prisma schema matches entity structure

---

## Webhook Security

### Signature Verification

**Always verify webhook signatures** to ensure requests are from Stripe:

```typescript
// This is done automatically by StripeAdapter
const event = await stripeAdapter.constructWebhookEvent(body, signature);
```

**Never skip signature verification** in production. This prevents attackers from sending fake webhook events.

### Environment Separation

- Use **test mode** webhook secrets for development
- Use **live mode** webhook secrets for production
- Never commit webhook secrets to version control

### Idempotency

Stripe may send the same webhook event multiple times. Ensure your handlers are idempotent:

- Check if subscription already exists before creating
- Use upsert operations where possible
- Log event IDs to detect duplicates

---

## Monitoring & Logging

### Check Webhook Logs in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click on your endpoint
4. View **Recent events** and **Response logs**

### Application Logs

Monitor your application logs for webhook processing:

```bash
# Development
npm run dev

# Production (Vercel)
vercel logs

# Production (Railway)
railway logs
```

### Key Log Messages

✅ **Success:**
```
[Webhook] Received event: checkout.session.completed (evt_xxxxx)
[Webhook] Successfully processed checkout.session.completed
```

❌ **Failure:**
```
[Webhook] Signature verification failed
[Webhook] Error processing checkout.session.completed
```

---

## Next Steps

1. ✅ Configure webhooks in Stripe Dashboard
2. ✅ Add `STRIPE_WEBHOOK_SECRET` to environment variables
3. ✅ Test webhook events in local development
4. ✅ Deploy to production with webhook secret
5. 🔲 Implement email notifications for payment failures
6. 🔲 Add webhook event logging to database
7. 🔲 Set up monitoring alerts for webhook failures

---

## Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Testing Webhooks Locally](https://stripe.com/docs/webhooks/test)
- [Webhook Event Reference](https://stripe.com/docs/api/events/types)

---

## Support

If you encounter issues:

1. Check Stripe Dashboard webhook logs
2. Review application logs for detailed errors
3. Verify environment variables are set correctly
4. Test with Stripe CLI to isolate issues
5. Consult Stripe support or documentation
