/**
 * Post Data Transfer Objects
 * Plain TypeScript interfaces for API communication
 * NO domain logic, NO Prisma types
 */

/**
 * Full Post DTO for API responses
 * Represents a forum post with engagement metrics
 */
export interface PostDto {
  id: string;
  communityId: string;
  authorId: string;
  title: string;
  content: string; // HTML content
  isPinned: boolean;
  isSolved: boolean;
  likeCount: number;
  helpfulCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null; // null indicates draft status
  isArchived: boolean;
}

/**
 * Create Post DTO for API requests
 * Creates a post in draft status
 */
export interface CreatePostDto {
  communityId: string;
  authorId: string;
  title: string;
  content: string; // HTML content
}

/**
 * Update Post DTO for API requests
 * Allows partial updates to title and content
 */
export interface UpdatePostDto {
  title?: string;
  content?: string;
}

/**
 * Publish Post DTO for API requests
 * Transitions post from draft to published
 */
export interface PublishPostDto {
  postId: string;
}

/**
 * Pin Post DTO for API requests
 * Toggles pinned status for moderation
 */
export interface PinPostDto {
  postId: string;
  isPinned: boolean;
}

/**
 * Mark Solved DTO for API requests
 * Marks post as resolved/solved
 */
export interface MarkSolvedDto {
  postId: string;
}
