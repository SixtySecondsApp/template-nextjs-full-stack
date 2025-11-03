import { Comment } from "@/domain/comment/comment.entity";
import type { Comment as PrismaComment } from "@/generated/prisma";

/**
 * CommentPrismaMapper converts between Comment domain entity and Prisma persistence models.
 *
 * Part of the Infrastructure layer - isolates domain from Prisma implementation details.
 *
 * Key responsibilities:
 * - Convert Prisma Comment → Comment domain entity (toDomain)
 * - Convert Comment domain entity → Prisma persistence format (toPersistence)
 * - Handle type transformations and validation during conversion
 * - Support threading via parentId (max 2 levels in V1)
 */
export class CommentPrismaMapper {
  /**
   * Convert Prisma Comment model to Comment domain entity.
   *
   * @param prismaComment Prisma Comment model
   * @returns Comment domain entity
   */
  static toDomain(prismaComment: PrismaComment): Comment {
    return Comment.reconstitute({
      id: prismaComment.id,
      postId: prismaComment.postId,
      authorId: prismaComment.authorId,
      parentId: prismaComment.parentId,
      content: prismaComment.content,
      likeCount: prismaComment.likeCount,
      helpfulCount: prismaComment.helpfulCount,
      createdAt: prismaComment.createdAt,
      updatedAt: prismaComment.updatedAt,
      deletedAt: prismaComment.deletedAt,
    });
  }

  /**
   * Convert Comment domain entity to Prisma Comment persistence format.
   *
   * @param comment Comment domain entity
   * @returns Prisma Comment create/update input data
   */
  static toPersistence(comment: Comment): {
    id: string;
    postId: string;
    authorId: string;
    parentId: string | null;
    content: string;
    likeCount: number;
    helpfulCount: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  } {
    return {
      id: comment.getId(),
      postId: comment.getPostId(),
      authorId: comment.getAuthorId(),
      parentId: comment.getParentId(),
      content: comment.getContent(),
      likeCount: comment.getLikeCount(),
      helpfulCount: comment.getHelpfulCount(),
      createdAt: comment.getCreatedAt(),
      updatedAt: comment.getUpdatedAt(),
      deletedAt: comment.getDeletedAt(),
    };
  }
}
