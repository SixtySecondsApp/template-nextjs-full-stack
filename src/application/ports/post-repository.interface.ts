import { Post } from "@/domain/post/post.entity";

/**
 * Post Repository Interface (Port)
 * Defines contract for Post persistence operations.
 * Implementations live in infrastructure layer.
 */

export interface PostFilter {
  isPinned?: boolean;
  isSolved?: boolean;
  isDraft?: boolean;
  authorId?: string;
  limit?: number;
  offset?: number;
  sortBy?: "createdAt" | "publishedAt" | "viewCount" | "likeCount";
  sortOrder?: "asc" | "desc";
}

export interface IPostRepository {
  /**
   * Create a new post in the database.
   * @param post - Post domain entity
   * @returns Persisted post entity
   */
  create(post: Post): Promise<Post>;

  /**
   * Find a post by ID.
   * Returns null if not found or soft deleted.
   * @param id - Post ID
   * @returns Post entity or null
   */
  findById(id: string): Promise<Post | null>;

  /**
   * Find a post by ID with all comments loaded.
   * Comments are returned in hierarchical structure (max 2 levels).
   * @param id - Post ID
   * @returns Post entity with comments or null
   */
  findByIdWithComments(id: string): Promise<Post | null>;

  /**
   * Find posts by community with optional filtering.
   * Returns only non-deleted posts.
   * @param communityId - Community ID
   * @param filter - Optional filter criteria
   * @returns Array of post entities
   */
  findByCommunity(communityId: string, filter?: PostFilter): Promise<Post[]>;

  /**
   * Update an existing post.
   * @param post - Post domain entity with updated values
   * @returns Updated post entity
   */
  update(post: Post): Promise<Post>;

  /**
   * Soft delete a post by setting deletedAt timestamp.
   * @param id - Post ID
   */
  softDelete(id: string): Promise<void>;

  /**
   * Increment the view counter for a post.
   * Optimised operation to avoid loading full entity.
   * @param id - Post ID
   */
  incrementViewCount(id: string): Promise<void>;

  /**
   * Recalculate and update counters (likeCount, commentCount) from database.
   * Used to fix inconsistencies or sync denormalised counts.
   * @param postId - Post ID
   */
  updateCounts(postId: string): Promise<void>;

  /**
   * Restore a soft-deleted post.
   * @param id - Post ID
   */
  restore(id: string): Promise<void>;
}
