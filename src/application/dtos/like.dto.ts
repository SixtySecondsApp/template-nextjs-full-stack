/**
 * Like Data Transfer Objects
 * Plain TypeScript interfaces for like/reaction management
 * NO domain logic, NO Prisma types
 */

/**
 * Like DTO for API responses
 * Represents a user's like on a post or comment
 */
export interface LikeDto {
  id: string;
  userId: string;
  postId: string | null;
  commentId: string | null;
  createdAt: string; // ISO 8601 string
}

/**
 * Like Post DTO for API requests
 * Toggle like on a post
 */
export interface LikePostDto {
  userId: string;
  postId: string;
}

/**
 * Like Response DTO for API responses
 * Returns current like state and count
 */
export interface LikeResponseDto {
  isLiked: boolean;
  likeCount: number;
}

/**
 * Like Comment DTO for API requests
 * Toggle like on a comment
 */
export interface LikeCommentDto {
  userId: string;
  commentId: string;
}
