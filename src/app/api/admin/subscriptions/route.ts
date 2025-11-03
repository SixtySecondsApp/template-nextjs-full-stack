/**
 * GET /api/admin/subscriptions
 * Get list of recent subscriptions for admin dashboard
 * Requires admin role
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    // Authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // TODO: Check if user has admin role
    // const user = await getUserUseCase.execute({ userId })
    // if (!user.isAdmin) {
    //   return NextResponse.json(
    //     { success: false, message: "Forbidden" },
    //     { status: 403 }
    //   );
    // }

    // TODO: Replace with actual use case call
    // const listSubscriptionsUseCase = new ListSubscriptionsUseCase(...)
    // const result = await listSubscriptionsUseCase.execute({ limit: 10 })

    // Mock response for development
    const mockSubscriptions = [
      {
        id: "sub_001",
        userName: "John Doe",
        userEmail: "john@example.com",
        planName: "Premium",
        status: "ACTIVE" as const,
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "sub_002",
        userName: "Jane Smith",
        userEmail: "jane@example.com",
        planName: "Premium",
        status: "TRIALING" as const,
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "sub_003",
        userName: "Bob Johnson",
        userEmail: "bob@example.com",
        planName: "Premium",
        status: "ACTIVE" as const,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "sub_004",
        userName: "Alice Williams",
        userEmail: "alice@example.com",
        planName: "Premium",
        status: "CANCELLED" as const,
        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "sub_005",
        userName: "Charlie Brown",
        userEmail: "charlie@example.com",
        planName: "Premium",
        status: "PAST_DUE" as const,
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockSubscriptions,
    });
  } catch (error) {
    console.error("List subscriptions error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to list subscriptions",
      },
      { status: 500 }
    );
  }
}
