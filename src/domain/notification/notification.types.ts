/**
 * Types for Notification domain entity.
 * Used by factory methods to create/reconstitute Notification instances.
 */

/**
 * Types of notifications supported in the system.
 */
export enum NotificationType {
  MENTION = "MENTION", // User was @mentioned in post/comment
  REPLY = "REPLY", // User's post/comment received a reply
  NEW_POST = "NEW_POST", // New post in a followed thread/community
  LIKE = "LIKE", // User's post/comment was liked
  COMMENT_ON_POST = "COMMENT_ON_POST", // New comment on user's post
}

/**
 * Input for creating a new Notification entity.
 * Only includes required fields for notification creation.
 */
export interface CreateNotificationInput {
  id: string;
  userId: string;
  communityId: string;
  type: NotificationType;
  message: string;
  linkUrl: string | null;
  actorId: string | null;
}

/**
 * Input for reconstituting a Notification entity from persistence.
 * Includes all fields including timestamps and state.
 */
export interface ReconstituteNotificationInput {
  id: string;
  userId: string;
  communityId: string;
  type: NotificationType;
  message: string;
  linkUrl: string | null;
  actorId: string | null;
  isRead: boolean;
  createdAt: Date;
  deletedAt: Date | null;
}
