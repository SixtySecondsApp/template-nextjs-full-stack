/**
 * Update Comment Use Case
 * Updates comment content
 * Only allows updates to non-archived comments
 */

import { ICommentRepository } from "@/ports/repositories";
import { UpdateCommentDto, CommentDto } from "@/application/dtos/comment.dto";
import { CommentDtoMapper } from "@/application/mappers/comment-dto.mapper";
import { CommentError } from "@/application/errors/comment.errors";

export class UpdateCommentUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  /**
   * Execute update comment operation
   * Updates content and sets updatedAt
   * @param commentId Comment ID to update
   * @param input UpdateCommentDto with new content
   * @returns Updated CommentDto
   * @throws Error with CommentError enum values
   */
  async execute(commentId: string, input: UpdateCommentDto): Promise<CommentDto> {
    try {
      if (!commentId || commentId.trim().length === 0) {
        throw new Error(CommentError.INVALID_INPUT);
      }

      // Validate content
      if (!input.content || input.content.trim().length === 0) {
        throw new Error(CommentError.INVALID_CONTENT);
      }

      // Find comment
      const comment = await this.commentRepository.findById(commentId);
      if (!comment) {
        throw new Error(CommentError.COMMENT_NOT_FOUND);
      }

      // Check if archived
      if (comment.getDeletedAt() !== null) {
        throw new Error(CommentError.CANNOT_MODIFY_ARCHIVED_COMMENT);
      }

      // Update comment via domain method
      comment.update({ content: input.content });

      // Persist changes
      const updated = await this.commentRepository.update(comment);

      return CommentDtoMapper.toDto(updated);
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === CommentError.INVALID_INPUT ||
          error.message === CommentError.INVALID_CONTENT ||
          error.message === CommentError.COMMENT_NOT_FOUND ||
          error.message === CommentError.CANNOT_MODIFY_ARCHIVED_COMMENT
        ) {
          throw error;
        }
        if (error.message.includes("Invalid content")) {
          throw new Error(CommentError.INVALID_CONTENT);
        }
      }
      throw new Error(CommentError.INTERNAL_SERVER_ERROR);
    }
  }
}
