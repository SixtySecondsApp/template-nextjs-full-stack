import { NotificationType } from "./notification.types";

/**
 * Domain event emitted when a new notification is created.
 */
export class NotificationCreatedEvent {
  constructor(
    public readonly notificationId: string,
    public readonly userId: string,
    public readonly communityId: string,
    public readonly type: NotificationType,
    public readonly message: string,
    public readonly actorId: string | null,
    public readonly occurredAt: Date = new Date()
  ) {}
}

/**
 * Domain event emitted when a notification is marked as read.
 */
export class NotificationReadEvent {
  constructor(
    public readonly notificationId: string,
    public readonly userId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}

/**
 * Domain event emitted when a notification is marked as unread.
 */
export class NotificationUnreadEvent {
  constructor(
    public readonly notificationId: string,
    public readonly userId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}

/**
 * Domain event emitted when a notification is archived (soft deleted).
 */
export class NotificationArchivedEvent {
  constructor(
    public readonly notificationId: string,
    public readonly userId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}

/**
 * Domain event emitted when a notification is restored from archived state.
 */
export class NotificationRestoredEvent {
  constructor(
    public readonly notificationId: string,
    public readonly userId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}
