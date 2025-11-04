import { PostAttachment } from "@/domain/post/post-attachment.vo";

/**
 * PostAttachment Repository Interface (Port)
 * Defines contract for PostAttachment persistence operations.
 * Implementations live in infrastructure layer.
 */
export interface IPostAttachmentRepository {
  /**
   * Create a new post attachment in the database.
   * @param attachment - PostAttachment value object
   * @returns Persisted attachment value object
   */
  create(attachment: PostAttachment): Promise<PostAttachment>;

  /**
   * Find all attachments for a post.
   * Returns only non-deleted attachments.
   * @param postId - Post ID
   * @returns Array of attachment value objects
   */
  findByPost(postId: string): Promise<PostAttachment[]>;

  /**
   * Find a single attachment by ID.
   * Returns null if not found or soft deleted.
   * @param id - Attachment ID
   * @returns PostAttachment value object or null
   */
  findById(id: string): Promise<PostAttachment | null>;

  /**
   * Soft delete an attachment by setting deletedAt timestamp.
   * @param id - Attachment ID
   */
  delete(id: string): Promise<void>;

  /**
   * Restore a soft-deleted attachment.
   * @param id - Attachment ID
   */
  restore(id: string): Promise<void>;
}
