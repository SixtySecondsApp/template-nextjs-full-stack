/**
 * GET /api/subscriptions/[id]
 * Get user's subscription details
 *
 * DELETE /api/subscriptions/[id]
 * Cancel subscription
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // TODO: Replace with actual use case call
    // const getSubscriptionUseCase = new GetSubscriptionUseCase(...)
    // const result = await getSubscriptionUseCase.execute({ id, userId })

    // Mock response for development
    const mockSubscription = {
      id,
      userId,
      paymentTierId: "tier_001",
      status: "ACTIVE",
      interval: "MONTHLY",
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      cancelAtPeriodEnd: false,
      trialEnd: null,
      stripeCustomerId: "cus_mock",
      stripeSubscriptionId: "sub_mock",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };

    return NextResponse.json({
      success: true,
      data: mockSubscription,
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get subscription",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // TODO: Replace with actual use case call
    // const cancelSubscriptionUseCase = new CancelSubscriptionUseCase(...)
    // const result = await cancelSubscriptionUseCase.execute({ id, userId })

    // Mock response for development
    const mockUpdatedSubscription = {
      id,
      userId,
      paymentTierId: "tier_001",
      status: "ACTIVE",
      interval: "MONTHLY",
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      cancelAtPeriodEnd: true, // Now set to cancel
      trialEnd: null,
      stripeCustomerId: "cus_mock",
      stripeSubscriptionId: "sub_mock",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };

    return NextResponse.json({
      success: true,
      data: mockUpdatedSubscription,
      message: "Subscription will be cancelled at the end of the billing period",
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to cancel subscription",
      },
      { status: 500 }
    );
  }
}
