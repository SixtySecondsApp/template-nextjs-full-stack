/**
 * Get User Notifications Use Case
 * Retrieves all notifications for a user
 * Returns unread notifications first, then read notifications
 */

import { INotificationRepository, IUserRepository } from "@/ports/repositories";
import { NotificationDto } from "@/application/dtos/notification.dto";
import { NotificationDtoMapper } from "@/application/mappers/notification-dto.mapper";

/**
 * Get User Notifications error types
 */
export enum GetUserNotificationsError {
  // Validation errors (400)
  INVALID_USER_ID = "INVALID_USER_ID",

  // Not found errors (404)
  USER_NOT_FOUND = "USER_NOT_FOUND",

  // Server errors (500)
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export class GetUserNotificationsUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Execute get user notifications operation
   * Returns notifications sorted by createdAt DESC (newest first)
   * Unread notifications appear before read notifications
   *
   * @param userId User ID to fetch notifications for
   * @param limit Maximum number of notifications to return (default: 50)
   * @returns Array of NotificationDto sorted by priority and date
   * @throws Error with GetUserNotificationsError enum values
   */
  async execute(userId: string, limit: number = 50): Promise<NotificationDto[]> {
    try {
      // Validate input
      if (!userId || userId.trim().length === 0) {
        throw new Error(GetUserNotificationsError.INVALID_USER_ID);
      }

      // Verify user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error(GetUserNotificationsError.USER_NOT_FOUND);
      }

      // Fetch notifications from repository
      const notifications = await this.notificationRepository.findByUserId(
        userId,
        true // includeRead
      );

      // Sort: unread first, then by createdAt DESC
      const sorted = notifications.sort((a, b) => {
        // Unread notifications first
        if (a.getIsRead() !== b.getIsRead()) {
          return a.getIsRead() ? 1 : -1;
        }
        // Then by creation date (newest first)
        return b.getCreatedAt().getTime() - a.getCreatedAt().getTime();
      });

      // Apply limit
      const limited = sorted.slice(0, limit);

      // Fetch actor names for notifications
      const actorIds = limited
        .map((n) => n.getActorId())
        .filter((id): id is string => id !== null);
      const uniqueActorIds = Array.from(new Set(actorIds));

      const actorNames = new Map<string, string>();
      for (const actorId of uniqueActorIds) {
        const actor = await this.userRepository.findById(actorId);
        if (actor) {
          actorNames.set(actorId, actor.getName() || "Unknown User");
        }
      }

      // Map to DTOs
      return NotificationDtoMapper.toDtoArray(limited, actorNames);
    } catch (error) {
      if (error instanceof Error) {
        // Re-throw known errors
        if (
          error.message === GetUserNotificationsError.INVALID_USER_ID ||
          error.message === GetUserNotificationsError.USER_NOT_FOUND
        ) {
          throw error;
        }
      }

      throw new Error(GetUserNotificationsError.INTERNAL_SERVER_ERROR);
    }
  }
}
