/**
 * Create Post Use Case
 * Creates a new post in draft status
 * Orchestrates domain logic and publishes domain events
 */

import { IPostRepository } from "@/ports/repositories";
import { Post } from "@/domain/post/post.entity";
import { CreatePostDto, PostDto } from "@/application/dtos/post.dto";
import { PostDtoMapper } from "@/application/mappers/post-dto.mapper";
import { PostError } from "@/application/errors/post.errors";

export class CreatePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  /**
   * Execute create post operation
   * Creates post in draft status (publishedAt = null)
   * @param input CreatePostDto with required fields
   * @returns PostDto with assigned ID and timestamps
   * @throws Error with PostError enum values
   */
  async execute(input: CreatePostDto): Promise<PostDto> {
    try {
      // Validate input
      if (!input.title || input.title.trim().length === 0) {
        throw new Error(PostError.INVALID_TITLE);
      }
      if (!input.content || input.content.trim().length === 0) {
        throw new Error(PostError.INVALID_CONTENT);
      }

      // Create domain entity
      const post = Post.create({
        id: crypto.randomUUID(),
        communityId: input.communityId,
        authorId: input.authorId,
        title: input.title,
        content: input.content,
      });

      // Persist via repository
      const created = await this.postRepository.create(post);

      // Return DTO
      return PostDtoMapper.toDto(created);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === PostError.INVALID_TITLE) {
          throw error;
        }
        if (error.message === PostError.INVALID_CONTENT) {
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
