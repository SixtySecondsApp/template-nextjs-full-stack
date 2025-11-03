/**
 * Pin Post Use Case
 * Toggles pinned status for moderation purposes
 * Pinned posts appear at top of community post lists
 */

import { IPostRepository } from "@/ports/repositories";
import { PostDto } from "@/application/dtos/post.dto";
import { PostDtoMapper } from "@/application/mappers/post-dto.mapper";
import { PostError } from "@/application/errors/post.errors";

export class PinPostUseCase {
  constructor(private postRepository: IPostRepository) {}

  /**
   * Execute pin/unpin post operation
   * Sets isPinned status for display priority
   * @param postId Post ID to pin/unpin
   * @param isPinned Target pinned state
   * @returns Updated PostDto
   * @throws Error with PostError enum values
   */
  async execute(postId: string, isPinned: boolean): Promise<PostDto> {
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
        throw new Error(PostError.CANNOT_PIN_ARCHIVED_POST);
      }

      // Set pinned status
      if (isPinned) {
        post.pin();
      } else {
        post.unpin();
      }

      // Persist changes
      const updated = await this.postRepository.update(post);

      return PostDtoMapper.toDto(updated);
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === PostError.INVALID_INPUT ||
          error.message === PostError.POST_NOT_FOUND ||
          error.message === PostError.CANNOT_PIN_ARCHIVED_POST
        ) {
          throw error;
        }
      }
      throw new Error(PostError.INTERNAL_SERVER_ERROR);
    }
  }
}
