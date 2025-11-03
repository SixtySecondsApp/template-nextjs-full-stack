/**
 * POST /api/checkout/calculate
 * Calculate checkout price with optional coupon code
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const calculateSchema = z.object({
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
    const validatedData = calculateSchema.parse(body);

    // TODO: Replace with actual use case call
    // const calculateCheckoutUseCase = new CalculateCheckoutUseCase(...)
    // const result = await calculateCheckoutUseCase.execute(validatedData)

    // Mock response for development
    const mockCalculation = {
      paymentTierId: validatedData.paymentTierId,
      interval: validatedData.interval,
      subtotal: validatedData.interval === "MONTHLY" ? 2900 : 29000, // $29 or $290
      discount: validatedData.couponCode ? 500 : 0, // $5 off with coupon
      total:
        validatedData.interval === "MONTHLY"
          ? validatedData.couponCode
            ? 2400
            : 2900
          : validatedData.couponCode
            ? 28500
            : 29000,
      couponCode: validatedData.couponCode || null,
      hasTrialPeriod: true,
      trialDays: 7,
    };

    return NextResponse.json({
      success: true,
      data: mockCalculation,
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

    console.error("Calculate checkout error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to calculate checkout",
      },
      { status: 500 }
    );
  }
}
