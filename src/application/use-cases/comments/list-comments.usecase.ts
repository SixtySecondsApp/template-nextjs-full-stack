/**
 * List Comments Use Case
 * Retrieves all comments for a post with threading support
 * Returns comments organised hierarchically with replies nested under parents
 */

import { ICommentRepository } from "@/ports/repositories";
import { CommentDto } from "@/application/dtos/comment.dto";
import { CommentDtoMapper } from "@/application/mappers/comment-dto.mapper";
import { CommentError } from "@/application/errors/comment.errors";

export class ListCommentsUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  /**
   * Execute list comments operation
   * Returns threaded comment tree with replies nested
   * @param postId Post ID to list comments for
   * @returns Array of top-level CommentDto with nested replies
   * @throws Error with CommentError enum values
   */
  async execute(postId: string): Promise<CommentDto[]> {
    try {
      if (!postId || postId.trim().length === 0) {
        throw new Error(CommentError.INVALID_INPUT);
      }

      // Find all comments for post (repository handles ordering)
      const comments = await this.commentRepository.findByPostId(postId);

      // Build hierarchical tree with replies nested
      return CommentDtoMapper.toDtoTree(comments);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === CommentError.INVALID_INPUT) {
          throw error;
        }
      }
      throw new Error(CommentError.INTERNAL_SERVER_ERROR);
    }
  }
}
