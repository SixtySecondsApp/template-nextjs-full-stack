import { Comment } from "@/domain/comment/comment.entity";

/**
 * Comment Repository Interface (Port)
 * Defines contract for Comment persistence operations.
 * Implementations live in infrastructure layer.
 */
export interface ICommentRepository {
  /**
   * Create a new comment in the database.
   * @param comment - Comment domain entity
   * @returns Persisted comment entity
   */
  create(comment: Comment): Promise<Comment>;

  /**
   * Find a comment by ID.
   * Returns null if not found or soft deleted.
   * @param id - Comment ID
   * @returns Comment entity or null
   */
  findById(id: string): Promise<Comment | null>;

  /**
   * Find all comments for a post in hierarchical structure.
   * Top-level comments (parentId = null) with nested replies (max 2 levels).
   * Returns only non-deleted comments.
   * @param postId - Post ID
   * @returns Array of comment entities in tree structure
   */
  findByPost(postId: string): Promise<Comment[]>;

  /**
   * Find all replies to a parent comment.
   * Returns only non-deleted comments.
   * @param parentId - Parent comment ID
   * @returns Array of reply comment entities
   */
  findReplies(parentId: string): Promise<Comment[]>;

  /**
   * Update an existing comment.
   * @param comment - Comment domain entity with updated values
   * @returns Updated comment entity
   */
  update(comment: Comment): Promise<Comment>;

  /**
   * Soft delete a comment by setting deletedAt timestamp.
   * @param id - Comment ID
   */
  softDelete(id: string): Promise<void>;

  /**
   * Restore a soft-deleted comment.
   * @param id - Comment ID
   */
  restore(id: string): Promise<void>;

  /**
   * Count total comments for a post (excluding deleted).
   * @param postId - Post ID
   * @returns Total comment count
   */
  countByPost(postId: string): Promise<number>;
}
