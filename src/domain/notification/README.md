# Notification Domain Entity

## Overview

The Notification entity represents a notification sent to a user about community activity. It follows hexagonal architecture principles with pure domain logic and no framework dependencies.

## Business Rules

### Validation Rules
- **Message**: 1-500 characters, required
- **User ID**: Required (recipient of notification)
- **Community ID**: Required
- **Type**: Must be one of the defined NotificationType values
- **Link URL**: Optional, can be null for system-generated notifications
- **Actor ID**: Optional, represents the user who triggered the notification

### State Management
- **Unread State**: Notifications start as unread (`isRead = false`)
- **Read State**: Once marked as read, can be toggled back to unread
- **Archived State**: Notifications can be soft deleted and restored

### Notification Types

- **MENTION**: User was @mentioned in a post or comment
- **REPLY**: User's post or comment received a reply
- **NEW_POST**: New post in a followed thread or community
- **LIKE**: User's post or comment was liked
- **COMMENT_ON_POST**: New comment on user's post

## Usage Examples

### Creating a Mention Notification

```typescript
import { Notification } from "@/domain/notification/notification.entity";
import {
  NotificationType,
  CreateNotificationInput,
} from "@/domain/notification/notification.types";

const input: CreateNotificationInput = {
  id: "notif_123",
  userId: "user_789", // Recipient
  communityId: "comm_456",
  type: NotificationType.MENTION,
  message: "John Doe mentioned you in a comment",
  linkUrl: "/communities/comm_456/posts/post_123#comment_456",
  actorId: "user_john", // User who created the mention
};

const notification = Notification.create(input);

console.log(notification.getIsRead()); // false
console.log(notification.getType()); // "MENTION"
```

### Creating a Reply Notification

```typescript
const replyNotification = Notification.create({
  id: "notif_124",
  userId: "user_original_author",
  communityId: "comm_456",
  type: NotificationType.REPLY,
  message: "Jane Smith replied to your comment",
  linkUrl: "/communities/comm_456/posts/post_123#comment_789",
  actorId: "user_jane",
});
```

### Creating a System Notification (No Actor)

```typescript
const systemNotification = Notification.create({
  id: "notif_125",
  userId: "user_789",
  communityId: "comm_456",
  type: NotificationType.NEW_POST,
  message: "New post in a thread you're following",
  linkUrl: "/communities/comm_456/posts/post_999",
  actorId: null, // System-generated, no specific actor
});
```

### Marking as Read

```typescript
const notification = Notification.create({...});

// Mark as read
notification.markAsRead();
console.log(notification.getIsRead()); // true

// Mark as unread
notification.markAsUnread();
console.log(notification.getIsRead()); // false
```

### Archiving and Restoring

```typescript
const notification = Notification.create({...});

// Archive (soft delete)
notification.archive();
console.log(notification.isArchived()); // true

// Restore from archive
notification.restore();
console.log(notification.isArchived()); // false
```

### Error Handling

```typescript
const notification = Notification.create({...});

// Cannot mark archived notification as read
notification.archive();
try {
  notification.markAsRead();
} catch (error) {
  console.error(error.message); // "Cannot modify archived notification"
}

// Cannot mark already read notification as read
notification.restore();
notification.markAsRead();
try {
  notification.markAsRead();
} catch (error) {
  console.error(error.message); // "Notification is already marked as read"
}

// Cannot create notification with empty message
try {
  Notification.create({
    id: "notif_126",
    userId: "user_789",
    communityId: "comm_456",
    type: NotificationType.MENTION,
    message: "", // Invalid
    linkUrl: "/link",
    actorId: "user_john",
  });
} catch (error) {
  console.error(error.message); // "Notification message cannot be empty"
}
```

### Reconstituting from Persistence

```typescript
import { ReconstituteNotificationInput } from "@/domain/notification/notification.types";

// Load notification from database
const persistedData: ReconstituteNotificationInput = {
  id: "notif_123",
  userId: "user_789",
  communityId: "comm_456",
  type: NotificationType.MENTION,
  message: "John Doe mentioned you in a comment",
  linkUrl: "/communities/comm_456/posts/post_123#comment_456",
  actorId: "user_john",
  isRead: true,
  createdAt: new Date("2024-01-01"),
  deletedAt: null,
};

const notification = Notification.reconstitute(persistedData);

console.log(notification.getIsRead()); // true
console.log(notification.getMessage()); // "John Doe mentioned you in a comment"
```

## Method Reference

### Factory Methods
- `Notification.create(input: CreateNotificationInput): Notification` - Create new unread notification
- `Notification.reconstitute(input: ReconstituteNotificationInput): Notification` - Reconstitute from persistence

### Getters
- `getId(): string` - Get notification ID
- `getUserId(): string` - Get recipient user ID
- `getCommunityId(): string` - Get community ID
- `getType(): NotificationType` - Get notification type
- `getMessage(): string` - Get notification message
- `getLinkUrl(): string | null` - Get deep link URL (null if none)
- `getActorId(): string | null` - Get actor user ID (null if system)
- `getIsRead(): boolean` - Check if notification is read
- `getCreatedAt(): Date` - Get creation timestamp
- `getDeletedAt(): Date | null` - Get deletion timestamp (null if active)
- `isArchived(): boolean` - Check if notification is archived

### Business Logic Methods
- `markAsRead(): void` - Mark notification as read
- `markAsUnread(): void` - Mark notification as unread
- `archive(): void` - Archive (soft delete) the notification
- `restore(): void` - Restore from archived state

## Architecture Notes

- **Pure Domain Logic**: No dependencies on frameworks, databases, or external services
- **Immutable IDs**: Notification ID, user ID, community ID, type, and actor ID cannot be changed after creation
- **Encapsulation**: All fields are private with public getters
- **Validation**: Message validation occurs in constructor via private method
- **Soft Delete**: Uses `deletedAt` field instead of hard deletion
- **Timestamps**: `createdAt` managed automatically on creation

## Integration with Phase 4 Features

### @Mentions
When a user mentions another user using `@[userId:userName]` syntax in a post or comment, a notification of type `MENTION` should be created for each mentioned user.

### Reply Tracking
When a user replies to a post or comment, a notification of type `REPLY` should be created for the original author.

### Post Activity
When a user's post receives a new comment, a notification of type `COMMENT_ON_POST` should be created for the post author.

### Engagement
When a user's content receives a like, a notification of type `LIKE` can be created (optional, may be batched to prevent spam).
