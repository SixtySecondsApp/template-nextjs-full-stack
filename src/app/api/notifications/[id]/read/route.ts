import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  MarkNotificationReadUseCase,
  MarkNotificationReadError,
} from "@/application/use-cases/notifications/mark-notification-read.usecase";
import { NotificationRepositoryPrisma } from "@/infrastructure/repositories/notification.repository.prisma";

/**
 * API Route: PATCH /api/notifications/[id]/read
 * Mark a specific notification as read.
 *
 * Architecture:
 * - Thin controller layer - validation and orchestration only
 * - Delegates business logic to MarkNotificationReadUseCase
 * - Uses Clerk for authentication
 * - Validates user ownership of notification
 *
 * Error Mapping:
 * - 401: Unauthorized (not authenticated)
 * - 403: UNAUTHORIZED (notification belongs to different user)
 * - 404: NOTIFICATION_NOT_FOUND
 * - 500: INTERNAL_SERVER_ERROR
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Extract notification ID from route params
    const { id: notificationId } = await params;

    // Instantiate use case with repository
    const repository = new NotificationRepositoryPrisma();
    const useCase = new MarkNotificationReadUseCase(repository);

    // Execute use case
    await useCase.execute({ notificationId, userId });

    // Return success
    return NextResponse.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    // Use case errors
    if (error instanceof Error) {
      if (error.message === MarkNotificationReadError.NOTIFICATION_NOT_FOUND) {
        return NextResponse.json(
          { success: false, message: "Notification not found" },
          { status: 404 }
        );
      }
      if (error.message === MarkNotificationReadError.UNAUTHORIZED) {
        return NextResponse.json(
          {
            success: false,
            message: "You do not have permission to mark this notification",
          },
          { status: 403 }
        );
      }
    }

    // Internal server error
    console.error("[Mark As Read Error]:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
