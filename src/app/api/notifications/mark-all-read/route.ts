import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { MarkAllReadUseCase } from "@/application/use-cases/notifications/mark-all-read.usecase";
import { NotificationRepositoryPrisma } from "@/infrastructure/repositories/notification.repository.prisma";

/**
 * API Route: POST /api/notifications/mark-all-read
 * Mark all notifications as read for the authenticated user.
 *
 * Architecture:
 * - Thin controller layer - validation and orchestration only
 * - Delegates business logic to MarkAllReadUseCase
 * - Uses Clerk for authentication
 * - Bulk update operation
 *
 * Error Mapping:
 * - 401: Unauthorized (not authenticated)
 * - 500: INTERNAL_SERVER_ERROR
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Instantiate use case with repository
    const repository = new NotificationRepositoryPrisma();
    const useCase = new MarkAllReadUseCase(repository);

    // Execute use case
    await useCase.execute({ userId });

    // Return success
    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    // Internal server error
    console.error("[Mark All Read Error]:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
