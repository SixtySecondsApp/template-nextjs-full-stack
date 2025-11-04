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

/**
 * Post with Comments DTO for API responses
 * Full post details with threaded comments
 */
export interface PostWithCommentsDto {
  post: PostDto;
  comments: CommentTreeDto[];
  userHasLiked: boolean; // Whether current user liked the post
}

/**
 * Comment Tree DTO for threaded comments
 * Supports 2-level nesting (top-level + replies)
 */
export interface CommentTreeDto {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  likeCount: number;
  helpfulCount: number;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
  replies: CommentReplyDto[]; // Nested replies (max 1 level)
}

/**
 * Comment Reply DTO for nested comments
 * Second level of threading
 */
export interface CommentReplyDto {
  id: string;
  postId: string;
  parentId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  likeCount: number;
  helpfulCount: number;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

/**
 * List Posts DTO for API responses
 * Paginated list of posts with metadata
 */
export interface ListPostsDto {
  posts: PostDto[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * List Posts Query DTO for API requests
 * Query parameters for listing posts
 */
export interface ListPostsQueryDto {
  communityId: string;
  filter: 'all' | 'new' | 'active' | 'top';
  page?: number; // Default 1
  limit?: number; // Default 20
}
