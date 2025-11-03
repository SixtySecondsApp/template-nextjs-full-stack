/**
 * Mark Notification Read Use Case
 * Marks a single notification as read
 * Verifies notification belongs to user for security
 */

import { INotificationRepository } from "@/ports/repositories";

/**
 * Mark Notification Read error types
 */
export enum MarkNotificationReadError {
  // Validation errors (400)
  INVALID_NOTIFICATION_ID = "INVALID_NOTIFICATION_ID",
  INVALID_USER_ID = "INVALID_USER_ID",

  // Not found errors (404)
  NOTIFICATION_NOT_FOUND = "NOTIFICATION_NOT_FOUND",

  // Forbidden errors (403)
  NOTIFICATION_NOT_OWNED_BY_USER = "NOTIFICATION_NOT_OWNED_BY_USER",

  // Conflict errors (409)
  NOTIFICATION_ALREADY_READ = "NOTIFICATION_ALREADY_READ",
  NOTIFICATION_ARCHIVED = "NOTIFICATION_ARCHIVED",

  // Server errors (500)
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export class MarkNotificationReadUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  /**
   * Execute mark notification read operation
   * Verifies notification belongs to user before marking as read
   *
   * @param notificationId Notification ID to mark as read
   * @param userId User ID making the request (security check)
   * @throws Error with MarkNotificationReadError enum values
   */
  async execute(notificationId: string, userId: string): Promise<void> {
    try {
      // Validate input
      if (!notificationId || notificationId.trim().length === 0) {
        throw new Error(MarkNotificationReadError.INVALID_NOTIFICATION_ID);
      }

      if (!userId || userId.trim().length === 0) {
        throw new Error(MarkNotificationReadError.INVALID_USER_ID);
      }

      // Find notification
      const notification =
        await this.notificationRepository.findById(notificationId);

      if (!notification) {
        throw new Error(MarkNotificationReadError.NOTIFICATION_NOT_FOUND);
      }

      // Security check: verify notification belongs to user
      if (notification.getUserId() !== userId) {
        throw new Error(
          MarkNotificationReadError.NOTIFICATION_NOT_OWNED_BY_USER
        );
      }

      // Check if already read
      if (notification.getIsRead()) {
        throw new Error(MarkNotificationReadError.NOTIFICATION_ALREADY_READ);
      }

      // Check if archived
      if (notification.isArchived()) {
        throw new Error(MarkNotificationReadError.NOTIFICATION_ARCHIVED);
      }

      // Mark as read (domain method)
      notification.markAsRead();

      // Persist via repository
      await this.notificationRepository.update(notification);
    } catch (error) {
      if (error instanceof Error) {
        // Re-throw known errors
        if (
          error.message === MarkNotificationReadError.INVALID_NOTIFICATION_ID ||
          error.message === MarkNotificationReadError.INVALID_USER_ID ||
          error.message === MarkNotificationReadError.NOTIFICATION_NOT_FOUND ||
          error.message ===
            MarkNotificationReadError.NOTIFICATION_NOT_OWNED_BY_USER ||
          error.message === MarkNotificationReadError.NOTIFICATION_ALREADY_READ ||
          error.message === MarkNotificationReadError.NOTIFICATION_ARCHIVED
        ) {
          throw error;
        }

        // Map domain errors
        if (error.message.includes("already marked as read")) {
          throw new Error(MarkNotificationReadError.NOTIFICATION_ALREADY_READ);
        }
        if (error.message.includes("Cannot modify archived")) {
          throw new Error(MarkNotificationReadError.NOTIFICATION_ARCHIVED);
        }
      }

      throw new Error(MarkNotificationReadError.INTERNAL_SERVER_ERROR);
    }
  }
}
