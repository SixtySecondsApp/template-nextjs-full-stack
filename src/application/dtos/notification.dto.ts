/**
 * Notification Data Transfer Objects
 * Plain TypeScript interfaces for API communication
 * NO domain logic, NO Prisma types
 */

import { NotificationType } from "@/domain/notification/notification.types";

/**
 * Full Notification DTO for API responses
 * Represents a user notification with actor information
 */
export interface NotificationDto {
  id: string;
  userId: string;
  communityId: string;
  type: NotificationType;
  message: string;
  linkUrl: string | null;
  actorId: string | null;
  actorName: string | null; // Fetched from User entity
  isRead: boolean;
  createdAt: string; // ISO string for JSON serialisation
  deletedAt: string | null; // ISO string for JSON serialisation
}

/**
 * Create Notification DTO for use case input
 * Used to create new notifications
 */
export interface CreateNotificationDto {
  userId: string;
  communityId: string;
  type: NotificationType;
  message: string;
  linkUrl: string | null;
  actorId: string | null;
}

/**
 * Unread Count DTO for API responses
 * Returns the count of unread notifications
 */
export interface UnreadCountDto {
  count: number;
}
