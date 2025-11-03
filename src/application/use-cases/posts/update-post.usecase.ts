/**
 * Update Post Use Case
 * Updates post title and/or content
 * Only allows updates to non-archived posts
 */

import { IPostRepository } from "@/ports/repositories";
import { UpdatePostDto, PostDto } from "@/application/dtos/post.dto";
import { PostDtoMapper } from "@/application/mappers/post-dto.mapper";
import { PostError } from "@/application/errors/post.errors";

export class UpdatePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  /**
   * Execute update post operation
   * Updates title and/or content, sets updatedAt
   * @param postId Post ID to update
   * @param input UpdatePostDto with optional title and content
   * @returns Updated PostDto
   * @throws Error with PostError enum values
   */
  async execute(postId: string, input: UpdatePostDto): Promise<PostDto> {
    try {
      if (!postId || postId.trim().length === 0) {
        throw new Error(PostError.INVALID_INPUT);
      }

      // Validate at least one field provided
      if (!input.title && !input.content) {
        throw new Error(PostError.INVALID_INPUT);
      }

      // Find post
      const post = await this.postRepository.findById(postId);
      if (!post) {
        throw new Error(PostError.POST_NOT_FOUND);
      }

      // Check if archived
      if (post.getDeletedAt() !== null) {
        throw new Error(PostError.CANNOT_MODIFY_ARCHIVED_POST);
      }

      // Update post via domain method
      post.update({
        title: input.title,
        content: input.content,
      });

      // Persist changes
      const updated = await this.postRepository.update(post);

      return PostDtoMapper.toDto(updated);
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === PostError.INVALID_INPUT ||
          error.message === PostError.POST_NOT_FOUND ||
          error.message === PostError.CANNOT_MODIFY_ARCHIVED_POST
        ) {
          throw error;
        }
        if (error.message.includes("Invalid title")) {
          throw new Error(PostError.INVALID_TITLE);
        }
        if (error.message.includes("Invalid content")) {
          throw new Error(PostError.INVALID_CONTENT);
        }
      }
      throw new Error(PostError.INTERNAL_SERVER_ERROR);
    }
  }
}
