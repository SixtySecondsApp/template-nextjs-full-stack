/**
 * Archive Comment Use Case
 * Soft deletes a comment by setting deletedAt timestamp
 * Archived comments excluded from default queries
 */

import { ICommentRepository } from "@/ports/repositories";
import { CommentError } from "@/application/errors/comment.errors";

export class ArchiveCommentUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  /**
   * Execute archive comment operation
   * Sets deletedAt timestamp for soft delete
   * @param commentId Comment ID to archive
   * @returns void
   * @throws Error with CommentError enum values
   */
  async execute(commentId: string): Promise<void> {
    try {
      if (!commentId || commentId.trim().length === 0) {
        throw new Error(CommentError.INVALID_INPUT);
      }

      // Find comment
      const comment = await this.commentRepository.findById(commentId);
      if (!comment) {
        throw new Error(CommentError.COMMENT_NOT_FOUND);
      }

      // Check if already archived
      if (comment.getDeletedAt() !== null) {
        throw new Error(CommentError.COMMENT_ALREADY_ARCHIVED);
      }

      // Archive comment via repository
      await this.commentRepository.archive(commentId);
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === CommentError.INVALID_INPUT ||
          error.message === CommentError.COMMENT_NOT_FOUND ||
          error.message === CommentError.COMMENT_ALREADY_ARCHIVED
        ) {
          throw error;
        }
      }
      throw new Error(CommentError.INTERNAL_SERVER_ERROR);
    }
  }
}
