/**
 * Comment Data Transfer Objects
 * Plain TypeScript interfaces for API communication
 * NO domain logic, NO Prisma types
 */

/**
 * Full Comment DTO for API responses
 * Represents a forum comment with threading support
 */
export interface CommentDto {
  id: string;
  postId: string;
  authorId: string;
  parentId: string | null; // null for top-level comments
  content: string; // HTML content
  likeCount: number;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  replies?: CommentDto[]; // Optional nested replies for hierarchical display
}

/**
 * Create Comment DTO for API requests
 * Supports threading via optional parentId
 */
export interface CreateCommentDto {
  postId: string;
  authorId: string;
  parentId?: string; // Optional parent for threaded replies
  content: string; // HTML content
}

/**
 * Update Comment DTO for API requests
 * Allows content updates only
 */
export interface UpdateCommentDto {
  content: string;
}
