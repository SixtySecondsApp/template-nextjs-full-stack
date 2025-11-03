/**
 * Get Comment Use Case
 * Retrieves a single comment by ID
 * Used for displaying individual comment details
 */

import { ICommentRepository } from "@/ports/repositories";
import { CommentDto } from "@/application/dtos/comment.dto";
import { CommentDtoMapper } from "@/application/mappers/comment-dto.mapper";
import { CommentError } from "@/application/errors/comment.errors";

export class GetCommentUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  /**
   * Execute get comment operation
   * @param commentId Comment ID to retrieve
   * @returns CommentDto
   * @throws Error with CommentError enum values
   */
  async execute(commentId: string): Promise<CommentDto> {
    try {
      if (!commentId || commentId.trim().length === 0) {
        throw new Error(CommentError.INVALID_INPUT);
      }

      // Find comment
      const comment = await this.commentRepository.findById(commentId);
      if (!comment) {
        throw new Error(CommentError.COMMENT_NOT_FOUND);
      }

      return CommentDtoMapper.toDto(comment);
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === CommentError.INVALID_INPUT ||
          error.message === CommentError.COMMENT_NOT_FOUND
        ) {
          throw error;
        }
      }
      throw new Error(CommentError.INTERNAL_SERVER_ERROR);
    }
  }
}
