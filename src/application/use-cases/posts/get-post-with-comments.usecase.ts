/**
 * Get Post With Comments Use Case
 * Retrieves post with threaded comments (2-level nesting)
 * Checks if user liked the post
 * Increments view count
 */

import {
  IPostRepository,
  ICommentRepository,
  ILikeRepository,
  IUserRepository,
} from "@/ports/repositories";
import {
  PostWithCommentsDto,
  CommentTreeDto,
  CommentReplyDto,
} from "@/application/dtos/post.dto";
import { PostDtoMapper } from "@/application/mappers/post-dto.mapper";
import { PostError } from "@/application/errors/post.errors";

export class GetPostWithCommentsUseCase {
  constructor(
    private postRepository: IPostRepository,
    private commentRepository: ICommentRepository,
    private likeRepository: ILikeRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Execute get post with comments operation
   * Returns post with threaded comments and like status
   * Increments view count on each fetch
   * @param postId Post ID to retrieve
   * @param userId Optional current user ID to check like status
   * @returns PostWithCommentsDto
   * @throws Error with PostError enum values
   */
  async execute(
    postId: string,
    userId?: string
  ): Promise<PostWithCommentsDto> {
    try {
      // Validate input
      if (!postId || postId.trim().length === 0) {
        throw new Error(PostError.POST_NOT_FOUND);
      }

      // Find post
      const post = await this.postRepository.findById(postId);
      if (!post) {
        throw new Error(PostError.POST_NOT_FOUND);
      }

      // Check if archived
      if (post.getDeletedAt() !== null) {
        throw new Error(PostError.POST_NOT_FOUND);
      }

      // Increment view count
      post.incrementViewCount();
      await this.postRepository.update(post);

      // Check if user liked the post
      let userHasLiked = false;
      if (userId) {
        const like = await this.likeRepository.findByUserAndPost(
          userId,
          postId
        );
        userHasLiked = like !== null;
      }

      // Get all comments for post
      const comments = await this.commentRepository.findByPostId(postId);

      // Build comment tree (top-level comments with replies)
      const topLevelComments = comments.filter((c) => c.getParentId() === null);
      const replyMap = new Map<string, typeof comments>();

      // Group replies by parent ID
      comments
        .filter((c) => c.getParentId() !== null)
        .forEach((reply) => {
          const parentId = reply.getParentId()!;
          if (!replyMap.has(parentId)) {
            replyMap.set(parentId, []);
          }
          replyMap.get(parentId)!.push(reply);
        });

      // Build comment tree DTOs
      const commentTree: CommentTreeDto[] = await Promise.all(
        topLevelComments.map(async (comment) => {
          const author = await this.userRepository.findById(
            comment.getAuthorId()
          );

          // Get replies for this comment
          const replies = replyMap.get(comment.getId()) || [];
          const replyDtos: CommentReplyDto[] = await Promise.all(
            replies.map(async (reply) => {
              const replyAuthor = await this.userRepository.findById(
                reply.getAuthorId()
              );

              return {
                id: reply.getId(),
                postId: reply.getPostId(),
                parentId: reply.getParentId()!,
                authorId: reply.getAuthorId(),
                authorName: replyAuthor?.getName() || "Unknown",
                authorAvatar: replyAuthor?.getAvatarUrl() || null,
                content: reply.getContent(),
                likeCount: reply.getLikeCount(),
                helpfulCount: reply.getHelpfulCount(),
                createdAt: reply.getCreatedAt().toISOString(),
                updatedAt: reply.getUpdatedAt().toISOString(),
              };
            })
          );

          return {
            id: comment.getId(),
            postId: comment.getPostId(),
            authorId: comment.getAuthorId(),
            authorName: author?.getName() || "Unknown",
            authorAvatar: author?.getAvatarUrl() || null,
            content: comment.getContent(),
            likeCount: comment.getLikeCount(),
            helpfulCount: comment.getHelpfulCount(),
            createdAt: comment.getCreatedAt().toISOString(),
            updatedAt: comment.getUpdatedAt().toISOString(),
            replies: replyDtos,
          };
        })
      );

      return {
        post: PostDtoMapper.toDto(post),
        comments: commentTree,
        userHasLiked,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === PostError.POST_NOT_FOUND) {
          throw error;
        }
      }
      throw new Error(PostError.INTERNAL_SERVER_ERROR);
    }
  }
}
