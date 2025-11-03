import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { GetUserNotificationsUseCase } from "@/application/use-cases/notifications/get-user-notifications.usecase";
import { NotificationRepositoryPrisma } from "@/infrastructure/repositories/notification.repository.prisma";

/**
 * API Route: GET /api/notifications?includeRead=true
 * List notifications for the authenticated user.
 *
 * Architecture:
 * - Thin controller layer - validation and orchestration only
 * - Delegates business logic to GetUserNotificationsUseCase
 * - Uses Clerk for authentication
 * - Returns notification DTOs
 *
 * Query Parameters:
 * - includeRead: boolean (default: false) - Include read notifications
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

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const includeRead = searchParams.get("includeRead") === "true";

    // Instantiate use case with repository
    const repository = new NotificationRepositoryPrisma();
    const useCase = new GetUserNotificationsUseCase(repository);

    // Execute use case
    const notifications = await useCase.execute({
      userId,
      includeRead,
    });

    // Return notifications
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    // Internal server error
    console.error("[Get Notifications Error]:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
