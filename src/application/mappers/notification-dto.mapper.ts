/**
 * Notification DTO Mapper
 * Converts between Domain Notification entities and NotificationDto
 * Maintains strict boundary between application and domain layers
 */

import { Notification } from "@/domain/notification/notification.entity";
import { NotificationDto } from "@/application/dtos/notification.dto";

export class NotificationDtoMapper {
  /**
   * Convert Notification domain entity to NotificationDto
   * @param notification Domain Notification entity
   * @param actorName Name of the actor who triggered the notification (fetched from User)
   * @returns NotificationDto for API responses
   */
  static toDto(notification: Notification, actorName: string | null): NotificationDto {
    return {
      id: notification.getId(),
      userId: notification.getUserId(),
      communityId: notification.getCommunityId(),
      type: notification.getType(),
      message: notification.getMessage(),
      linkUrl: notification.getLinkUrl(),
      actorId: notification.getActorId(),
      actorName,
      isRead: notification.getIsRead(),
      createdAt: notification.getCreatedAt().toISOString(),
      deletedAt: notification.getDeletedAt()?.toISOString() || null,
    };
  }

  /**
   * Convert array of Notification entities to array of NotificationDtos
   * @param notifications Array of domain Notification entities
   * @param actorNames Map of actorId to actor name
   * @returns Array of NotificationDto for API responses
   */
  static toDtoArray(
    notifications: Notification[],
    actorNames: Map<string, string>
  ): NotificationDto[] {
    return notifications.map((notification) =>
      this.toDto(
        notification,
        actorNames.get(notification.getActorId() || "") || null
      )
    );
  }
}
