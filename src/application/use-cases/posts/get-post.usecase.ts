/**
 * Get Post Use Case
 * Retrieves a single post by ID and increments view count
 * Used for displaying post details
 */

import { IPostRepository } from "@/ports/repositories";
import { PostDto } from "@/application/dtos/post.dto";
import { PostDtoMapper } from "@/application/mappers/post-dto.mapper";
import { PostError } from "@/application/errors/post.errors";

export class GetPostUseCase {
  constructor(private postRepository: IPostRepository) {}

  /**
   * Execute get post operation
   * Increments view count on each retrieval
   * @param postId Post ID to retrieve
   * @returns PostDto with incremented view count
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

      // Increment view count
      post.incrementViewCount();

      // Persist view count update
      const updated = await this.postRepository.update(post);

      return PostDtoMapper.toDto(updated);
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === PostError.INVALID_INPUT ||
          error.message === PostError.POST_NOT_FOUND
        ) {
          throw error;
        }
      }
      throw new Error(PostError.INTERNAL_SERVER_ERROR);
    }
  }
}
