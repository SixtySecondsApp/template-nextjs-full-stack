import { INotificationRepository } from "@/ports/repositories";

/**
 * Mark All Read Use Case Error Enumeration
 */
export enum MarkAllReadError {
  USER_ID_REQUIRED = "USER_ID_REQUIRED",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

/**
 * Mark All Read Use Case Input
 */
export interface MarkAllReadInput {
  userId: string;
}

/**
 * Mark All Read Use Case
 *
 * Business Logic:
 * - Marks all unread notifications as read for a user
 * - Bulk update operation via repository
 * - No domain events (optional enhancement for V2)
 *
 * Architecture:
 * - Application layer - orchestration only
 * - Delegates bulk update to repository
 * - Efficient database operation (single UPDATE query)
 *
 * Error Handling:
 * - USER_ID_REQUIRED: User ID not provided
 * - INTERNAL_SERVER_ERROR: Database or unexpected errors
 */
export class MarkAllReadUseCase {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  async execute(input: MarkAllReadInput): Promise<void> {
    try {
      // Validation: User ID required
      if (!input.userId) {
        throw new Error(MarkAllReadError.USER_ID_REQUIRED);
      }

      // Bulk mark as read via repository
      await this.notificationRepository.markAllAsRead(input.userId);
    } catch (error) {
      // Re-throw known errors
      if (
        error instanceof Error &&
        Object.values(MarkAllReadError).includes(
          error.message as MarkAllReadError
        )
      ) {
        throw error;
      }

      // Wrap unknown errors
      console.error("[MarkAllReadUseCase Error]:", error);
      throw new Error(MarkAllReadError.INTERNAL_SERVER_ERROR);
    }
  }
}
