import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * API Route: GET /api/notifications/unread-count
 * Get count of unread notifications for the authenticated user.
 *
 * Architecture:
 * - Thin controller layer - validation and orchestration only
 * - Delegates business logic to GetUnreadCountUseCase
 * - Uses Clerk for authentication
 * - Returns unread count as number
 *
 * Error Mapping:
 * - 401: Unauthorized (not authenticated)
 * - 500: INTERNAL_SERVER_ERROR
 */
export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // TODO: Instantiate use case when application layer is ready
    // const repository = new NotificationRepositoryPrisma();
    // const useCase = new GetUnreadCountUseCase(repository);
    // const count = await useCase.execute(userId);

    // TEMPORARY: Return mock response until use case is implemented
    return NextResponse.json({
      success: true,
      message: "Unread count API route ready - waiting for application layer",
      data: { count: 0 },
    });

    // FINAL IMPLEMENTATION (uncomment when use cases ready):
    // return NextResponse.json({ success: true, data: { count } });
  } catch (error) {
    // Internal server error
    console.error("[Unread Count Error]:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
