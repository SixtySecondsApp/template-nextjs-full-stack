# Post Domain Entity

## Overview

The Post entity represents a forum post within a community. It follows hexagonal architecture principles with pure domain logic and no framework dependencies.

## Business Rules

### Validation Rules
- **Title**: 3-200 characters, required
- **Content**: Minimum 10 characters (rich text HTML), required
- **Draft State**: Posts start as drafts (`publishedAt = null`)
- **Published State**: Once published, `publishedAt` is set to current timestamp

### State Management
- **Draft Posts**: Cannot be pinned, solved, or viewed by other users
- **Published Posts**: Can be pinned, marked as solved, and viewed by community
- **Archived Posts**: Cannot be modified except for restoration

### Counter Management
- **Like Count**: Increments when users like the post
- **Helpful Count**: Increments when users mark post as helpful
- **Comment Count**: Increments/decrements when comments are added/removed
- **View Count**: Increments when users view the post

## Usage Examples

### Creating a New Post (Draft)

```typescript
import { Post } from "@/domain/post/post.entity";
import { CreatePostInput } from "@/domain/post/post.types";

const input: CreatePostInput = {
  id: "post_123",
  communityId: "comm_456",
  authorId: "user_789",
  title: "How do I implement authentication?",
  content: "<p>I need help with implementing authentication in my Next.js app...</p>",
};

const post = Post.create(input);

console.log(post.isDraft()); // true
console.log(post.isPublished()); // false
```

### Publishing a Post

```typescript
// Post starts as draft
const post = Post.create({
  id: "post_123",
  communityId: "comm_456",
  authorId: "user_789",
  title: "My First Post",
  content: "<p>This is the content of my post.</p>",
});

// Publish the post
post.publish();

console.log(post.isPublished()); // true
console.log(post.getPublishedAt()); // Date object
```

### Updating Post Content

```typescript
const post = Post.create({...});

// Update title and/or content
post.update({
  title: "Updated Post Title",
  content: "<p>Updated content with more details.</p>",
});

console.log(post.getTitle()); // "Updated Post Title"
console.log(post.getUpdatedAt()); // New timestamp
```

### Pinning a Post (Moderator/Admin Action)

```typescript
const post = Post.create({...});
post.publish(); // Must be published first

// Pin to top of community feed
post.pin();

console.log(post.getIsPinned()); // true

// Unpin
post.unpin();

console.log(post.getIsPinned()); // false
```

### Marking Post as Solved

```typescript
const post = Post.create({...});
post.publish(); // Must be published first

// Mark as solved (e.g., question answered)
post.markSolved();

console.log(post.getIsSolved()); // true

// Mark as unsolved
post.markUnsolved();

console.log(post.getIsSolved()); // false
```

### Managing Counters

```typescript
const post = Post.create({...});

// User likes the post
post.incrementLikeCount();
console.log(post.getLikeCount()); // 1

// User marks as helpful
post.incrementHelpfulCount();
console.log(post.getHelpfulCount()); // 1

// New comment added
post.incrementCommentCount();
console.log(post.getCommentCount()); // 1

// Comment deleted
post.decrementCommentCount();
console.log(post.getCommentCount()); // 0

// User views the post
post.incrementViewCount();
console.log(post.getViewCount()); // 1
```

### Archiving and Restoring

```typescript
const post = Post.create({...});

// Archive (soft delete)
post.archive();
console.log(post.isArchived()); // true

// Restore from archive
post.restore();
console.log(post.isArchived()); // false
```

### Error Handling

```typescript
const post = Post.create({...});

// Cannot publish archived post
post.archive();
try {
  post.publish();
} catch (error) {
  console.error(error.message); // "Cannot modify archived post"
}

// Cannot pin unpublished post
const draftPost = Post.create({...});
try {
  draftPost.pin();
} catch (error) {
  console.error(error.message); // "Cannot perform this action on unpublished post"
}

// Cannot mark draft as solved
try {
  draftPost.markSolved();
} catch (error) {
  console.error(error.message); // "Cannot perform this action on unpublished post"
}
```

### Reconstituting from Persistence

```typescript
import { ReconstitutePostInput } from "@/domain/post/post.types";

// Load post from database
const persistedData: ReconstitutePostInput = {
  id: "post_123",
  communityId: "comm_456",
  authorId: "user_789",
  title: "Existing Post",
  content: "<p>Content from database</p>",
  isPinned: true,
  isSolved: false,
  likeCount: 42,
  helpfulCount: 15,
  commentCount: 8,
  viewCount: 256,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-05"),
  publishedAt: new Date("2024-01-01"),
  deletedAt: null,
};

const post = Post.reconstitute(persistedData);

console.log(post.getLikeCount()); // 42
console.log(post.getIsPinned()); // true
```

## Method Reference

### Factory Methods
- `Post.create(input: CreatePostInput): Post` - Create new draft post
- `Post.reconstitute(input: ReconstitutePostInput): Post` - Reconstitute from persistence

### Getters
- `getId(): string` - Get post ID
- `getCommunityId(): string` - Get community ID
- `getAuthorId(): string` - Get author ID
- `getTitle(): string` - Get post title
- `getContent(): string` - Get post content (HTML)
- `getIsPinned(): boolean` - Check if post is pinned
- `getIsSolved(): boolean` - Check if post is marked as solved
- `getLikeCount(): number` - Get like count
- `getHelpfulCount(): number` - Get helpful count
- `getCommentCount(): number` - Get comment count
- `getViewCount(): number` - Get view count
- `getCreatedAt(): Date` - Get creation timestamp
- `getUpdatedAt(): Date` - Get last update timestamp
- `getPublishedAt(): Date | null` - Get publication timestamp (null if draft)
- `getDeletedAt(): Date | null` - Get deletion timestamp (null if active)
- `isArchived(): boolean` - Check if post is archived
- `isDraft(): boolean` - Check if post is a draft
- `isPublished(): boolean` - Check if post is published

### Business Logic Methods
- `update(input: UpdatePostInput): void` - Update title and/or content
- `publish(): void` - Publish the post
- `archive(): void` - Archive (soft delete) the post
- `restore(): void` - Restore from archived state
- `pin(): void` - Pin post to top of feed
- `unpin(): void` - Unpin post from top of feed
- `markSolved(): void` - Mark post as solved
- `markUnsolved(): void` - Mark post as unsolved
- `incrementLikeCount(): void` - Increment like counter
- `incrementHelpfulCount(): void` - Increment helpful counter
- `incrementCommentCount(): void` - Increment comment counter
- `decrementCommentCount(): void` - Decrement comment counter
- `incrementViewCount(): void` - Increment view counter

## Architecture Notes

- **Pure Domain Logic**: No dependencies on frameworks, databases, or external services
- **Immutable ID**: Post ID cannot be changed after creation
- **Encapsulation**: All fields are private with public getters
- **Validation**: All validation occurs in private methods called from constructor
- **Soft Delete**: Uses `deletedAt` field instead of hard deletion
- **Timestamps**: `createdAt` and `updatedAt` managed automatically
