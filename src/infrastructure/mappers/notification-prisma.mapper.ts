import { Notification } from "@/domain/notification/notification.entity";
import { NotificationType } from "@/domain/notification/notification.types";
import type { Notification as PrismaNotification } from "@/generated/prisma";

/**
 * NotificationPrismaMapper converts between Notification domain entity and Prisma persistence models.
 *
 * Part of the Infrastructure layer - isolates domain from Prisma implementation details.
 *
 * Key responsibilities:
 * - Convert Prisma Notification → Notification domain entity (toDomain)
 * - Convert Notification domain entity → Prisma persistence format (toPersistence)
 * - Handle type transformations and validation during conversion
 * - Map NotificationType enum between domain and Prisma
 */
export class NotificationPrismaMapper {
  /**
   * Convert Prisma Notification model to Notification domain entity.
   *
   * @param prismaNotification Prisma Notification model
   * @returns Notification domain entity
   */
  static toDomain(prismaNotification: PrismaNotification): Notification {
    return Notification.reconstitute({
      id: prismaNotification.id,
      userId: prismaNotification.userId,
      communityId: prismaNotification.communityId,
      type: prismaNotification.type as NotificationType,
      message: prismaNotification.message,
      linkUrl: prismaNotification.linkUrl,
      actorId: prismaNotification.actorId,
      isRead: prismaNotification.isRead,
      createdAt: prismaNotification.createdAt,
      deletedAt: prismaNotification.deletedAt,
    });
  }

  /**
   * Convert Notification domain entity to Prisma Notification persistence format.
   *
   * @param notification Notification domain entity
   * @returns Prisma Notification create/update input data
   */
  static toPersistence(notification: Notification): {
    id: string;
    userId: string;
    communityId: string;
    type: string;
    message: string;
    linkUrl: string | null;
    actorId: string | null;
    isRead: boolean;
    createdAt: Date;
    deletedAt: Date | null;
  } {
    return {
      id: notification.getId(),
      userId: notification.getUserId(),
      communityId: notification.getCommunityId(),
      type: notification.getType(),
      message: notification.getMessage(),
      linkUrl: notification.getLinkUrl(),
      actorId: notification.getActorId(),
      isRead: notification.getIsRead(),
      createdAt: notification.getCreatedAt(),
      deletedAt: notification.getDeletedAt(),
    };
  }
}
