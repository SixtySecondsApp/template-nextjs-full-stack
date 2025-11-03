/**
 * Archive Post Use Case
 * Soft deletes a post by setting deletedAt timestamp
 * Archived posts excluded from default queries
 */

import { IPostRepository } from "@/ports/repositories";
import { PostError } from "@/application/errors/post.errors";

export class ArchivePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  /**
   * Execute archive post operation
   * Sets deletedAt timestamp for soft delete
   * @param postId Post ID to archive
   * @returns void
   * @throws Error with PostError enum values
   */
  async execute(postId: string): Promise<void> {
    try {
      if (!postId || postId.trim().length === 0) {
        throw new Error(PostError.INVALID_INPUT);
      }

      // Find post
      const post = await this.postRepository.findById(postId);
      if (!post) {
        throw new Error(PostError.POST_NOT_FOUND);
      }

      // Check if already archived
      if (post.getDeletedAt() !== null) {
        throw new Error(PostError.POST_ALREADY_ARCHIVED);
      }

      // Archive post via repository
      await this.postRepository.archive(postId);
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === PostError.INVALID_INPUT ||
          error.message === PostError.POST_NOT_FOUND ||
          error.message === PostError.POST_ALREADY_ARCHIVED
        ) {
          throw error;
        }
      }
      throw new Error(PostError.INTERNAL_SERVER_ERROR);
    }
  }
}
