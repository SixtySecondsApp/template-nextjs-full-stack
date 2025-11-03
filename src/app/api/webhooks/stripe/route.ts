/**
 * Stripe Webhook Handler API Route
 * Receives and processes Stripe webhook events for subscription lifecycle
 * Presentation layer - thin controller, validates and delegates to use case
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { StripeAdapter } from '@/infrastructure/payment/stripe.adapter';
import { ProcessSubscriptionWebhookUseCase } from '@/application/use-cases/payment/process-subscription-webhook.usecase';
import { SubscriptionRepositoryPrisma } from '@/infrastructure/repositories/subscription.repository.prisma';

/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events for subscription management
 *
 * Webhook Events:
 * - checkout.session.completed: User completed checkout, create/update subscription
 * - customer.subscription.updated: Subscription renewed, changed, or cancelled
 * - customer.subscription.deleted: Subscription permanently deleted
 * - invoice.payment_succeeded: Successful payment
 * - invoice.payment_failed: Failed payment (mark past due)
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Get raw body for signature verification
    // IMPORTANT: Must use raw body, not parsed JSON
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature');

    if (!signature) {
      console.error('[Webhook] Missing Stripe signature header');
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }

    // 2. Construct and verify webhook event
    // This validates the signature to ensure the request came from Stripe
    const stripeAdapter = new StripeAdapter();
    let event;

    try {
      event = await stripeAdapter.constructWebhookEvent(body, signature);
    } catch (error) {
      console.error('[Webhook] Signature verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

    // 3. Process event based on type
    const subscriptionRepository = new SubscriptionRepositoryPrisma();
    const useCase = new ProcessSubscriptionWebhookUseCase(
      subscriptionRepository
    );

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await useCase.handleCheckoutCompleted(event.data.object);
          console.log(
            `[Webhook] Successfully processed checkout.session.completed`
          );
          break;

        case 'customer.subscription.updated':
          await useCase.handleSubscriptionUpdated(event.data.object);
          console.log(
            `[Webhook] Successfully processed customer.subscription.updated`
          );
          break;

        case 'customer.subscription.deleted':
          await useCase.handleSubscriptionDeleted(event.data.object);
          console.log(
            `[Webhook] Successfully processed customer.subscription.deleted`
          );
          break;

        case 'invoice.payment_succeeded':
          await useCase.handlePaymentSucceeded(event.data.object);
          console.log(
            `[Webhook] Successfully processed invoice.payment_succeeded`
          );
          break;

        case 'invoice.payment_failed':
          await useCase.handlePaymentFailed(event.data.object);
          console.log(
            `[Webhook] Successfully processed invoice.payment_failed`
          );
          break;

        default:
          console.log(`[Webhook] Unhandled event type: ${event.type}`);
          // Still return 200 for unhandled events to acknowledge receipt
      }
    } catch (processingError) {
      console.error(
        `[Webhook] Error processing ${event.type}:`,
        processingError
      );
      // Return 500 so Stripe will retry the webhook
      return NextResponse.json(
        { error: 'Webhook processing failed' },
        { status: 500 }
      );
    }

    // 4. Return 200 to acknowledge successful receipt
    // IMPORTANT: Stripe will retry if we don't return 200
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('[Webhook] Unexpected error:', error);

    // Return 500 for unexpected errors (Stripe will retry)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
