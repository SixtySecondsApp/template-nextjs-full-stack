/**
 * GET /api/subscriptions/[id]/portal
 * Get Stripe Customer Portal URL for managing subscription
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
    // const getCustomerPortalUrlUseCase = new GetCustomerPortalUrlUseCase(...)
    // const result = await getCustomerPortalUrlUseCase.execute({ subscriptionId: id, userId })

    // Mock response for development
    const mockPortalUrl = {
      url: `https://billing.stripe.com/p/session/test_mock_portal_session`,
    };

    return NextResponse.json({
      success: true,
      data: mockPortalUrl,
    });
  } catch (error) {
    console.error("Get customer portal error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get customer portal URL",
      },
      { status: 500 }
    );
  }
}
