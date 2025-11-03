import { Notification } from "@/domain/notification/notification.entity";
import { NotificationPrismaMapper } from "@/infrastructure/mappers/notification-prisma.mapper";
import { prisma } from "@/lib/prisma";

/**
 * INotificationRepository Interface
 * Defines persistence operations for Notification aggregate
 */
export interface INotificationRepository {
  /**
   * Create a new notification
   */
  create(notification: Notification): Promise<Notification>;

  /**
   * Find notification by ID (excludes archived by default)
   */
  findById(id: string): Promise<Notification | null>;

  /**
   * Find all notifications for a user
   * @param userId User ID
   * @param includeRead Optional flag to include read notifications
   */
  findByUserId(
    userId: string,
    includeRead?: boolean
  ): Promise<Notification[]>;

  /**
   * Count unread notifications for a user
   */
  findUnreadCount(userId: string): Promise<number>;

  /**
   * Mark single notification as read
   */
  markAsRead(id: string): Promise<void>;

  /**
   * Mark all notifications as read for a user
   */
  markAllAsRead(userId: string): Promise<void>;

  /**
   * Archive (soft delete) a notification
   */
  archive(id: string): Promise<void>;
}

/**
 * Prisma implementation of INotificationRepository.
 *
 * Part of the Infrastructure layer - implements the repository port using Prisma ORM.
 *
 * Key responsibilities:
 * - Execute database operations via Prisma client
 * - Apply soft delete filter to all find operations (deletedAt IS NULL)
 * - Use NotificationPrismaMapper to convert between domain entities and Prisma models
 * - Handle database errors and convert to domain-appropriate errors
 * - Order notifications by createdAt DESC (newest first)
 * - Limit results to 50 most recent notifications for performance
 */
export class NotificationRepositoryPrisma implements INotificationRepository {
  /**
   * Create a new notification.
   *
   * @param notification Notification domain entity
   */
  async create(notification: Notification): Promise<Notification> {
    try {
      const data = NotificationPrismaMapper.toPersistence(notification);

      const created = await prisma.notification.create({
        data: {
          id: data.id,
          userId: data.userId,
          communityId: data.communityId,
          type: data.type,
          message: data.message,
          linkUrl: data.linkUrl,
          actorId: data.actorId,
          isRead: data.isRead,
          createdAt: data.createdAt,
        },
      });

      return NotificationPrismaMapper.toDomain(created);
    } catch (error) {
      // Handle foreign key constraint violations
      if (
        error instanceof Error &&
        error.message.includes("Foreign key constraint")
      ) {
        if (error.message.includes("userId")) {
          throw new Error("User not found");
        }
        if (error.message.includes("communityId")) {
          throw new Error("Community not found");
        }
      }
      throw error;
    }
  }

  /**
   * Find a notification by its unique ID.
   * Excludes archived notifications by default.
   */
  async findById(id: string): Promise<Notification | null> {
    const prismaNotification = await prisma.notification.findFirst({
      where: {
        id,
        deletedAt: null, // Soft delete filter
      },
    });

    if (!prismaNotification) {
      return null;
    }

    return NotificationPrismaMapper.toDomain(prismaNotification);
  }

  /**
   * Find all notifications for a specific user.
   * Ordered by createdAt DESC (newest first).
   * Limited to 50 most recent for performance.
   *
   * @param userId User ID
   * @param includeRead Optional flag to include read notifications (default: false)
   */
  async findByUserId(
    userId: string,
    includeRead = false
  ): Promise<Notification[]> {
    const prismaNotifications = await prisma.notification.findMany({
      where: {
        userId,
        deletedAt: null, // Soft delete filter
        ...(includeRead ? {} : { isRead: false }), // Filter unread only if includeRead is false
      },
      orderBy: {
        createdAt: "desc", // Newest first
      },
      take: 50, // Limit to 50 most recent
    });

    return prismaNotifications.map(NotificationPrismaMapper.toDomain);
  }

  /**
   * Count unread notifications for a user.
   * Excludes archived notifications.
   *
   * @param userId User ID
   */
  async findUnreadCount(userId: string): Promise<number> {
    return await prisma.notification.count({
      where: {
        userId,
        isRead: false,
        deletedAt: null, // Soft delete filter
      },
    });
  }

  /**
   * Mark a single notification as read.
   *
   * @param id Notification ID
   */
  async markAsRead(id: string): Promise<void> {
    try {
      await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Record to update not found")
      ) {
        throw new Error("Notification not found or is archived");
      }
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user.
   * Only affects unread, non-archived notifications.
   *
   * @param userId User ID
   */
  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
        deletedAt: null, // Only update non-archived notifications
      },
      data: { isRead: true },
    });
  }

  /**
   * Archive (soft delete) a notification by setting deletedAt timestamp.
   *
   * @param id Notification ID
   */
  async archive(id: string): Promise<void> {
    try {
      const notification = await prisma.notification.findUnique({
        where: { id },
      });

      if (!notification) {
        throw new Error("Notification not found");
      }

      if (notification.deletedAt !== null) {
        throw new Error("Notification is already archived");
      }

      await prisma.notification.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Record to update not found")
      ) {
        throw new Error("Notification not found");
      }
      throw error;
    }
  }
}
