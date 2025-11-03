/**
 * Publish Post Use Case
 * Transitions post from draft to published status
 * Sets publishedAt timestamp and makes post visible to community
 */

import { IPostRepository } from "@/ports/repositories";
import { PostDto } from "@/application/dtos/post.dto";
import { PostDtoMapper } from "@/application/mappers/post-dto.mapper";
import { PostError } from "@/application/errors/post.errors";

export class PublishPostUseCase {
  constructor(private postRepository: IPostRepository) {}

  /**
   * Execute publish post operation
   * Sets publishedAt to current timestamp
   * @param postId Post ID to publish
   * @returns Updated PostDto
   * @throws Error with PostError enum values
   */
  async execute(postId: string): Promise<PostDto> {
    try {
      // Find post
      const post = await this.postRepository.findById(postId);
      if (!post) {
        throw new Error(PostError.POST_NOT_FOUND);
      }

      // Check if archived
      if (post.getDeletedAt() !== null) {
        throw new Error(PostError.CANNOT_PUBLISH_ARCHIVED_POST);
      }

      // Check if already published
      if (post.getPublishedAt() !== null) {
        throw new Error(PostError.POST_ALREADY_PUBLISHED);
      }

      // Publish post (sets publishedAt timestamp)
      post.publish();

      // Persist changes
      const updated = await this.postRepository.update(post);

      return PostDtoMapper.toDto(updated);
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === PostError.POST_NOT_FOUND ||
          error.message === PostError.CANNOT_PUBLISH_ARCHIVED_POST ||
          error.message === PostError.POST_ALREADY_PUBLISHED
        ) {
          throw error;
        }
      }
      throw new Error(PostError.INTERNAL_SERVER_ERROR);
    }
  }
}
