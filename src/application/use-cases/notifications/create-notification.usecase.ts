/**
 * Create Notification Use Case
 * Creates a notification when a user is mentioned or replied to
 * Orchestrates domain logic and sends email notifications
 */

import { INotificationRepository, IUserRepository } from "@/ports/repositories";
import { IEmailAdapter } from "@/infrastructure/email/ses-adapter";
import { Notification } from "@/domain/notification/notification.entity";
import {
  CreateNotificationDto,
  NotificationDto,
} from "@/application/dtos/notification.dto";
import { NotificationDtoMapper } from "@/application/mappers/notification-dto.mapper";

/**
 * Notification error types for use case operations
 * Maps to HTTP status codes in API routes:
 * - 400: Validation errors (INVALID_*)
 * - 404: Not found errors (*_NOT_FOUND)
 * - 500: Internal server errors
 */
export enum NotificationError {
  // Validation errors (400)
  INVALID_INPUT = "INVALID_INPUT",
  INVALID_MESSAGE = "INVALID_MESSAGE",
  MESSAGE_TOO_LONG = "MESSAGE_TOO_LONG",

  // Not found errors (404)
  USER_NOT_FOUND = "USER_NOT_FOUND",
  COMMUNITY_NOT_FOUND = "COMMUNITY_NOT_FOUND",
  ACTOR_NOT_FOUND = "ACTOR_NOT_FOUND",

  // Server errors (500)
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export class CreateNotificationUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private userRepository: IUserRepository,
    private emailAdapter: IEmailAdapter
  ) {}

  /**
   * Execute create notification operation
   * Creates notification and sends email asynchronously
   *
   * @param input CreateNotificationDto with required fields
   * @returns NotificationDto with assigned ID and timestamps
   * @throws Error with NotificationError enum values
   */
  async execute(input: CreateNotificationDto): Promise<NotificationDto> {
    try {
      // Validate input
      if (!input.message || input.message.trim().length === 0) {
        throw new Error(NotificationError.INVALID_MESSAGE);
      }

      if (!input.userId || input.userId.trim().length === 0) {
        throw new Error(NotificationError.INVALID_INPUT);
      }

      if (!input.communityId || input.communityId.trim().length === 0) {
        throw new Error(NotificationError.INVALID_INPUT);
      }

      // Verify user exists
      const user = await this.userRepository.findById(input.userId);
      if (!user) {
        throw new Error(NotificationError.USER_NOT_FOUND);
      }

      // Get actor name if actorId provided
      let actorName: string | null = null;
      if (input.actorId) {
        const actor = await this.userRepository.findById(input.actorId);
        if (!actor) {
          throw new Error(NotificationError.ACTOR_NOT_FOUND);
        }
        actorName = actor.getName();
      }

      // Create domain entity
      const notification = Notification.create({
        id: crypto.randomUUID(),
        userId: input.userId,
        communityId: input.communityId,
        type: input.type,
        message: input.message,
        linkUrl: input.linkUrl,
        actorId: input.actorId,
      });

      // Persist via repository
      const created = await this.notificationRepository.create(notification);

      // Send email notification asynchronously (don't await)
      this.sendEmailNotification(user.getEmail(), input.message, input.linkUrl)
        .catch((error) => {
          console.error("[CreateNotificationUseCase] Email send failed:", error);
        });

      // Return DTO
      return NotificationDtoMapper.toDto(created, actorName);
    } catch (error) {
      if (error instanceof Error) {
        // Re-throw known errors
        if (
          error.message === NotificationError.INVALID_MESSAGE ||
          error.message === NotificationError.INVALID_INPUT ||
          error.message === NotificationError.USER_NOT_FOUND ||
          error.message === NotificationError.ACTOR_NOT_FOUND
        ) {
          throw error;
        }

        // Map domain errors
        if (error.message.includes("message cannot be empty")) {
          throw new Error(NotificationError.INVALID_MESSAGE);
        }
        if (error.message.includes("message too long")) {
          throw new Error(NotificationError.MESSAGE_TOO_LONG);
        }
      }

      throw new Error(NotificationError.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Send email notification asynchronously
   * Private helper method for email delivery
   */
  private async sendEmailNotification(
    email: string,
    message: string,
    linkUrl: string | null
  ): Promise<void> {
    await this.emailAdapter.sendNotification({
      to: email,
      subject: "New Notification - Sixty Community",
      body: `
        <html>
          <body>
            <h2>New Notification</h2>
            <p>${message}</p>
            ${linkUrl ? `<p><a href="${linkUrl}">View details</a></p>` : ""}
          </body>
        </html>
      `,
    });
  }
}
