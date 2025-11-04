/**
 * Like Post Use Case
 * Toggles like on a post (create if not exists, delete if exists)
 * Updates post like count accordingly
 */

import {
  ILikeRepository,
  IPostRepository,
  IUserRepository,
} from "@/ports/repositories";
import { LikePostDto, LikeResponseDto } from "@/application/dtos/like.dto";
import { LikeError } from "@/application/errors/post.errors";

export class LikePostUseCase {
  constructor(
    private likeRepository: ILikeRepository,
    private postRepository: IPostRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Execute like/unlike post operation
   * Toggles like state and updates post like count
   * @param input LikePostDto with userId and postId
   * @returns LikeResponseDto with isLiked and likeCount
   * @throws Error with LikeError enum values
   */
  async execute(input: LikePostDto): Promise<LikeResponseDto> {
    try {
      // Validate input
      if (!input.userId || input.userId.trim().length === 0) {
        throw new Error(LikeError.USER_NOT_FOUND);
      }
      if (!input.postId || input.postId.trim().length === 0) {
        throw new Error(LikeError.POST_NOT_FOUND);
      }

      // Verify user exists
      const user = await this.userRepository.findById(input.userId);
      if (!user) {
        throw new Error(LikeError.USER_NOT_FOUND);
      }

      // Verify post exists and is not archived
      const post = await this.postRepository.findById(input.postId);
      if (!post) {
        throw new Error(LikeError.POST_NOT_FOUND);
      }
      if (post.getDeletedAt() !== null) {
        throw new Error(LikeError.POST_NOT_FOUND);
      }

      // Check if user already liked this post
      const existingLike = await this.likeRepository.findByUserAndPost(
        input.userId,
        input.postId
      );

      let isLiked: boolean;

      if (existingLike) {
        // Unlike: delete like and decrement count
        await this.likeRepository.delete(existingLike.id);
        // Note: We don't decrement in domain - we recalculate from repository
        isLiked = false;
      } else {
        // Like: create like and increment count
        const like = {
          id: crypto.randomUUID(),
          userId: input.userId,
          postId: input.postId,
          commentId: null,
          createdAt: new Date(),
        };

        await this.likeRepository.create(like);
        post.incrementLikeCount();
        await this.postRepository.update(post);
        isLiked = true;
      }

      // Get current like count
      const likeCount = await this.likeRepository.countByPost(input.postId);

      return {
        isLiked,
        likeCount,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === LikeError.POST_NOT_FOUND ||
          error.message === LikeError.USER_NOT_FOUND
        ) {
          throw error;
        }
      }
      throw new Error(LikeError.INTERNAL_SERVER_ERROR);
    }
  }
}
