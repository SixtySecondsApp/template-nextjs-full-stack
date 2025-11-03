/**
 * Mark Solved Use Case
 * Marks post as resolved/solved
 * Indicates question has been answered or issue resolved
 */

import { IPostRepository } from "@/ports/repositories";
import { PostDto } from "@/application/dtos/post.dto";
import { PostDtoMapper } from "@/application/mappers/post-dto.mapper";
import { PostError } from "@/application/errors/post.errors";

export class MarkSolvedUseCase {
  constructor(private postRepository: IPostRepository) {}

  /**
   * Execute mark solved operation
   * Sets isSolved to true for published posts
   * @param postId Post ID to mark as solved
   * @returns Updated PostDto
   * @throws Error with PostError enum values
   */
  async execute(postId: string): Promise<PostDto> {
    try {
      if (!postId || postId.trim().length === 0) {
        throw new Error(PostError.INVALID_INPUT);
      }

      // Find post
      const post = await this.postRepository.findById(postId);
      if (!post) {
        throw new Error(PostError.POST_NOT_FOUND);
      }

      // Check if archived
      if (post.getDeletedAt() !== null) {
        throw new Error(PostError.CANNOT_SOLVE_ARCHIVED_POST);
      }

      // Check if published (can't solve draft posts)
      if (post.getPublishedAt() === null) {
        throw new Error(PostError.CANNOT_SOLVE_DRAFT_POST);
      }

      // Mark as solved
      post.markSolved();

      // Persist changes
      const updated = await this.postRepository.update(post);

      return PostDtoMapper.toDto(updated);
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === PostError.INVALID_INPUT ||
          error.message === PostError.POST_NOT_FOUND ||
          error.message === PostError.CANNOT_SOLVE_ARCHIVED_POST ||
          error.message === PostError.CANNOT_SOLVE_DRAFT_POST
        ) {
          throw error;
        }
      }
      throw new Error(PostError.INTERNAL_SERVER_ERROR);
    }
  }
}
