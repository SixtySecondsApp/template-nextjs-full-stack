/**
 * List Posts Use Case
 * Retrieves all posts for a community
 * Returns posts ordered by pinned status, then by publishedAt (newest first)
 */

import { IPostRepository } from "@/ports/repositories";
import { PostDto } from "@/application/dtos/post.dto";
import { PostDtoMapper } from "@/application/mappers/post-dto.mapper";
import { PostError } from "@/application/errors/post.errors";

export class ListPostsUseCase {
  constructor(private postRepository: IPostRepository) {}

  /**
   * Execute list posts operation
   * Retrieves all published posts for a community
   * @param communityId Community ID to list posts for
   * @returns Array of PostDto ordered by pinned status, then publishedAt
   * @throws Error with PostError enum values
   */
  async execute(communityId: string): Promise<PostDto[]> {
    try {
      if (!communityId || communityId.trim().length === 0) {
        throw new Error(PostError.INVALID_INPUT);
      }

      // Find all posts for community (repository handles ordering)
      const posts = await this.postRepository.findByCommunityId(communityId);

      return PostDtoMapper.toDtoArray(posts);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === PostError.INVALID_INPUT) {
          throw error;
        }
      }
      throw new Error(PostError.INTERNAL_SERVER_ERROR);
    }
  }
}
