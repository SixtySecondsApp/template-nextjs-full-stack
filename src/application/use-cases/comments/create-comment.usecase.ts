/**
 * Create Comment Use Case
 * Creates a new comment or reply with threading support
 * Validates post existence, parent comment nesting, and increments post comment count
 */

import {
  ICommentRepository,
  IPostRepository,
} from "@/ports/repositories";
import { Comment } from "@/domain/comment/comment.entity";
import { CreateCommentDto, CommentDto } from "@/application/dtos/comment.dto";
import { CommentDtoMapper } from "@/application/mappers/comment-dto.mapper";
import { CommentError } from "@/application/errors/comment.errors";

export class CreateCommentUseCase {
  constructor(
    private commentRepository: ICommentRepository,
    private postRepository: IPostRepository
  ) {}

  /**
   * Execute create comment operation
   * Supports threading with max depth of 2 levels (V1 constraint)
   * @param input CreateCommentDto with postId, authorId, optional parentId, and content
   * @returns CommentDto with assigned ID and timestamps
   * @throws Error with CommentError enum values
   */
  async execute(input: CreateCommentDto): Promise<CommentDto> {
    try {
      // Validate input
      if (!input.content || input.content.trim().length === 0) {
        throw new Error(CommentError.INVALID_CONTENT);
      }

      // 1. Verify post exists and is not archived
      const post = await this.postRepository.findById(input.postId);
      if (!post) {
        throw new Error(CommentError.POST_NOT_FOUND);
      }
      if (post.getDeletedAt() !== null) {
        throw new Error(CommentError.CANNOT_COMMENT_ON_ARCHIVED_POST);
      }

      // 2. Verify parent comment if replying (threading validation)
      if (input.parentId) {
        const parent = await this.commentRepository.findById(input.parentId);
        if (!parent) {
          throw new Error(CommentError.PARENT_COMMENT_NOT_FOUND);
        }

        // Check parent not archived
        if (parent.getDeletedAt() !== null) {
          throw new Error(CommentError.CANNOT_REPLY_TO_ARCHIVED_COMMENT);
        }

        // Check nesting depth (max 2 levels in V1: comment → reply only)
        // If parent already has a parentId, this would be a third level
        if (parent.getParentId() !== null) {
          throw new Error(CommentError.MAX_NESTING_DEPTH_EXCEEDED);
        }
      }

      // 3. Create comment
      const comment = Comment.create({
        id: crypto.randomUUID(),
        postId: input.postId,
        authorId: input.authorId,
        parentId: input.parentId || null,
        content: input.content,
      });

      // 4. Persist comment
      const created = await this.commentRepository.create(comment);

      // 5. Increment post comment count
      post.incrementCommentCount();
      await this.postRepository.update(post);

      return CommentDtoMapper.toDto(created);
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === CommentError.INVALID_CONTENT ||
          error.message === CommentError.POST_NOT_FOUND ||
          error.message === CommentError.PARENT_COMMENT_NOT_FOUND ||
          error.message === CommentError.CANNOT_COMMENT_ON_ARCHIVED_POST ||
          error.message === CommentError.CANNOT_REPLY_TO_ARCHIVED_COMMENT ||
          error.message === CommentError.MAX_NESTING_DEPTH_EXCEEDED
        ) {
          throw error;
        }
        if (error.message.includes("Invalid content")) {
          throw new Error(CommentError.INVALID_CONTENT);
        }
      }
      throw new Error(CommentError.INTERNAL_SERVER_ERROR);
    }
  }
}
