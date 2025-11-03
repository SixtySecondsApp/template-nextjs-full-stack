import {
  CreateNotificationInput,
  NotificationType,
  ReconstituteNotificationInput,
} from "./notification.types";

/**
 * Notification entity represents a notification sent to a user within a community.
 * Follows hexagonal architecture with pure domain logic - NO framework dependencies.
 *
 * Business Rules:
 * - Message: Required, 1-500 characters
 * - Notifications start as unread (isRead = false)
 * - Cannot modify archived notifications
 * - Cannot mark archived notifications as read
 * - Each notification belongs to one user and one community
 * - Each notification optionally links to an actor (the user who triggered it)
 * - linkUrl is optional and can be null for system-generated notifications
 */

export class Notification {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly communityId: string,
    private readonly type: NotificationType,
    private message: string,
    private linkUrl: string | null,
    private readonly actorId: string | null,
    private isRead: boolean,
    private readonly createdAt: Date,
    private deletedAt: Date | null
  ) {
    this.validateMessage(message);
  }

  /**
   * Factory method to create a new Notification entity.
   * Notification starts as unread.
   */
  static create(input: CreateNotificationInput): Notification {
    return new Notification(
      input.id,
      input.userId,
      input.communityId,
      input.type,
      input.message,
      input.linkUrl,
      input.actorId,
      false, // isRead
      new Date(),
      null // deletedAt
    );
  }

  /**
   * Factory method to reconstitute a Notification entity from persistence.
   */
  static reconstitute(input: ReconstituteNotificationInput): Notification {
    return new Notification(
      input.id,
      input.userId,
      input.communityId,
      input.type,
      input.message,
      input.linkUrl,
      input.actorId,
      input.isRead,
      input.createdAt,
      input.deletedAt
    );
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getCommunityId(): string {
    return this.communityId;
  }

  getType(): NotificationType {
    return this.type;
  }

  getMessage(): string {
    return this.message;
  }

  getLinkUrl(): string | null {
    return this.linkUrl;
  }

  getActorId(): string | null {
    return this.actorId;
  }

  getIsRead(): boolean {
    return this.isRead;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getDeletedAt(): Date | null {
    return this.deletedAt;
  }

  isArchived(): boolean {
    return this.deletedAt !== null;
  }

  // Business logic methods

  /**
   * Mark the notification as read.
   * @throws Error if notification is archived
   */
  markAsRead(): void {
    this.ensureNotArchived();

    if (this.isRead) {
      throw new Error("Notification is already marked as read");
    }

    this.isRead = true;
  }

  /**
   * Mark the notification as unread.
   * @throws Error if notification is archived
   */
  markAsUnread(): void {
    this.ensureNotArchived();

    if (!this.isRead) {
      throw new Error("Notification is already marked as unread");
    }

    this.isRead = false;
  }

  /**
   * Archive (soft delete) the notification.
   * @throws Error if notification is already archived
   */
  archive(): void {
    if (this.isArchived()) {
      throw new Error("Notification is already archived");
    }

    this.deletedAt = new Date();
  }

  /**
   * Restore notification from archived state.
   * @throws Error if notification is not archived
   */
  restore(): void {
    if (!this.isArchived()) {
      throw new Error("Notification is not archived");
    }

    this.deletedAt = null;
  }

  // Private validation methods

  private validateMessage(message: string): void {
    if (!message || message.trim().length === 0) {
      throw new Error("Notification message cannot be empty");
    }

    if (message.length > 500) {
      throw new Error("Notification message too long (max 500 characters)");
    }
  }

  private ensureNotArchived(): void {
    if (this.isArchived()) {
      throw new Error("Cannot modify archived notification");
    }
  }
}
