# Comment Domain Entity

## Overview

The Comment entity represents a comment on a forum post. It supports threading (replies to comments) with a maximum depth of 2 levels in V1. It follows hexagonal architecture principles with pure domain logic and no framework dependencies.

## Business Rules

### Validation Rules
- **Content**: Minimum 1 character (rich text HTML), required
- **Threading**: Supports parent-child relationships via `parentId`
- **Nesting Depth**: Maximum 2 levels (top-level comment → reply) in V1

### State Management
- **Archived Comments**: Cannot be modified except for restoration
- **Thread Structure**: Comments can be top-level or replies to other comments

### Counter Management
- **Like Count**: Increments when users like the comment
- **Helpful Count**: Increments when users mark comment as helpful

## Usage Examples

### Creating a Top-Level Comment

```typescript
import { Comment } from "@/domain/comment/comment.entity";
import { CreateCommentInput } from "@/domain/comment/comment.types";

const input: CreateCommentInput = {
  id: "comment_123",
  postId: "post_456",
  authorId: "user_789",
  content: "<p>Great question! Here's my answer...</p>",
};

const comment = Comment.create(input);

console.log(comment.isTopLevel()); // true
console.log(comment.isReply()); // false
console.log(comment.getParentId()); // null
```

### Creating a Reply Comment

```typescript
const replyInput: CreateCommentInput = {
  id: "comment_124",
  postId: "post_456",
  authorId: "user_790",
  parentId: "comment_123", // Reply to comment_123
  content: "<p>Thanks for the answer! This helped me.</p>",
};

const reply = Comment.create(replyInput);

console.log(reply.isTopLevel()); // false
console.log(reply.isReply()); // true
console.log(reply.getParentId()); // "comment_123"
```

### Updating Comment Content

```typescript
const comment = Comment.create({...});

// Update content
comment.update("<p>Updated comment content with corrections.</p>");

console.log(comment.getContent()); // "<p>Updated comment content with corrections.</p>"
console.log(comment.getUpdatedAt()); // New timestamp
```

### Managing Counters

```typescript
const comment = Comment.create({...});

// User likes the comment
comment.incrementLikeCount();
console.log(comment.getLikeCount()); // 1

// User marks comment as helpful
comment.incrementHelpfulCount();
console.log(comment.getHelpfulCount()); // 1
```

### Archiving and Restoring

```typescript
const comment = Comment.create({...});

// Archive (soft delete)
comment.archive();
console.log(comment.isArchived()); // true

// Restore from archive
comment.restore();
console.log(comment.isArchived()); // false
```

### Error Handling

```typescript
const comment = Comment.create({...});

// Cannot update archived comment
comment.archive();
try {
  comment.update("<p>New content</p>");
} catch (error) {
  console.error(error.message); // "Cannot modify archived comment"
}

// Cannot archive already archived comment
try {
  comment.archive();
} catch (error) {
  console.error(error.message); // "Comment is already archived"
}

// Invalid content
try {
  comment.update("");
} catch (error) {
  console.error(error.message); // "Comment content is required"
}
```

### Reconstituting from Persistence

```typescript
import { ReconstituteCommentInput } from "@/domain/comment/comment.types";

// Load comment from database
const persistedData: ReconstituteCommentInput = {
  id: "comment_123",
  postId: "post_456",
  authorId: "user_789",
  parentId: null,
  content: "<p>This is an existing comment.</p>",
  likeCount: 25,
  helpfulCount: 10,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-02"),
  deletedAt: null,
};

const comment = Comment.reconstitute(persistedData);

console.log(comment.getLikeCount()); // 25
console.log(comment.getHelpfulCount()); // 10
```

### Threading Example

```typescript
// Top-level comment
const topLevelComment = Comment.create({
  id: "comment_1",
  postId: "post_123",
  authorId: "user_1",
  content: "<p>Top-level comment</p>",
});

// Reply to top-level comment (depth = 1)
const reply1 = Comment.create({
  id: "comment_2",
  postId: "post_123",
  authorId: "user_2",
  parentId: "comment_1",
  content: "<p>Reply to top-level comment</p>",
});

// Reply to reply (depth = 2) - Maximum allowed in V1
const reply2 = Comment.create({
  id: "comment_3",
  postId: "post_123",
  authorId: "user_3",
  parentId: "comment_2",
  content: "<p>Reply to reply</p>",
});

// Attempting to create deeper nesting should be prevented in use case
// (domain entity only validates content, nesting validation in use case)
```

## Method Reference

### Factory Methods
- `Comment.create(input: CreateCommentInput): Comment` - Create new comment
- `Comment.reconstitute(input: ReconstituteCommentInput): Comment` - Reconstitute from persistence

### Getters
- `getId(): string` - Get comment ID
- `getPostId(): string` - Get post ID
- `getAuthorId(): string` - Get author ID
- `getParentId(): string | null` - Get parent comment ID (null if top-level)
- `getContent(): string` - Get comment content (HTML)
- `getLikeCount(): number` - Get like count
- `getHelpfulCount(): number` - Get helpful count
- `getCreatedAt(): Date` - Get creation timestamp
- `getUpdatedAt(): Date` - Get last update timestamp
- `getDeletedAt(): Date | null` - Get deletion timestamp (null if active)
- `isArchived(): boolean` - Check if comment is archived
- `isReply(): boolean` - Check if comment is a reply (has parent)
- `isTopLevel(): boolean` - Check if comment is top-level (no parent)

### Business Logic Methods
- `update(content: string): void` - Update comment content
- `archive(): void` - Archive (soft delete) the comment
- `restore(): void` - Restore from archived state
- `incrementLikeCount(): void` - Increment like counter
- `incrementHelpfulCount(): void` - Increment helpful counter

## Threading Rules (V1)

### Maximum Depth: 2 Levels

```
Post
├── Comment (Top-level, depth = 0)
│   ├── Reply (depth = 1) ✅ Allowed
│   │   └── Reply (depth = 2) ✅ Allowed (Maximum)
│   │       └── Reply (depth = 3) ❌ NOT ALLOWED in V1
```

### Nesting Validation

The domain entity does not enforce nesting depth validation. This validation should occur in the **use case layer** before creating a comment:

1. Fetch parent comment (if `parentId` provided)
2. If parent has a `parentId`, check that it's not already at depth 2
3. Reject comment creation if nesting would exceed 2 levels

**Example Use Case Validation**:

```typescript
// In CreateCommentUseCase
if (input.parentId) {
  const parentComment = await commentRepository.findById(input.parentId);

  if (!parentComment) {
    throw new Error("Parent comment not found");
  }

  // Check if parent is already a reply (depth = 1)
  if (parentComment.getParentId() !== null) {
    // Check if grandparent exists (depth = 2 limit reached)
    const grandparentComment = await commentRepository.findById(
      parentComment.getParentId()
    );

    if (grandparentComment) {
      throw new Error("Maximum nesting depth (2 levels) exceeded");
    }
  }
}
```

## Architecture Notes

- **Pure Domain Logic**: No dependencies on frameworks, databases, or external services
- **Immutable IDs**: Comment ID, post ID, and parent ID cannot be changed after creation
- **Encapsulation**: All fields are private with public getters
- **Validation**: Content validation occurs in private methods
- **Soft Delete**: Uses `deletedAt` field instead of hard deletion
- **Timestamps**: `createdAt` and `updatedAt` managed automatically
- **Threading**: Parent-child relationships managed via `parentId` reference
