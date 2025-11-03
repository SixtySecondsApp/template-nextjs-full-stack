/**
 * POST /api/checkout/create
 * Create Stripe Checkout session and return redirect URL
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const createCheckoutSchema = z.object({
  paymentTierId: z.string().uuid(),
  interval: z.enum(["MONTHLY", "ANNUAL"]),
  couponCode: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    // Authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createCheckoutSchema.parse(body);

    // TODO: Replace with actual use case call
    // const createCheckoutSessionUseCase = new CreateCheckoutSessionUseCase(...)
    // const result = await createCheckoutSessionUseCase.execute({
    //   userId,
    //   ...validatedData
    // })

    // Mock response for development
    const mockSession = {
      sessionId: "cs_test_mock_session_id",
      checkoutUrl: `https://checkout.stripe.com/c/pay/cs_test_mock_session_id`,
    };

    return NextResponse.json({
      success: true,
      data: mockSession,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request data",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Create checkout error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create checkout session",
      },
      { status: 500 }
    );
  }
}
