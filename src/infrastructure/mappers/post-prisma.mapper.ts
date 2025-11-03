import { Post } from "@/domain/post/post.entity";
import type { Post as PrismaPost } from "@/generated/prisma";

/**
 * PostPrismaMapper converts between Post domain entity and Prisma persistence models.
 *
 * Part of the Infrastructure layer - isolates domain from Prisma implementation details.
 *
 * Key responsibilities:
 * - Convert Prisma Post → Post domain entity (toDomain)
 * - Convert Post domain entity → Prisma persistence format (toPersistence)
 * - Handle type transformations and validation during conversion
 */
export class PostPrismaMapper {
  /**
   * Convert Prisma Post model to Post domain entity.
   *
   * @param prismaPost Prisma Post model
   * @returns Post domain entity
   */
  static toDomain(prismaPost: PrismaPost): Post {
    return Post.reconstitute({
      id: prismaPost.id,
      communityId: prismaPost.communityId,
      authorId: prismaPost.authorId,
      title: prismaPost.title,
      content: prismaPost.content,
      isPinned: prismaPost.isPinned,
      isSolved: prismaPost.isSolved,
      likeCount: prismaPost.likeCount,
      helpfulCount: prismaPost.helpfulCount,
      commentCount: prismaPost.commentCount,
      viewCount: prismaPost.viewCount,
      publishedAt: prismaPost.publishedAt,
      createdAt: prismaPost.createdAt,
      updatedAt: prismaPost.updatedAt,
      deletedAt: prismaPost.deletedAt,
    });
  }

  /**
   * Convert Post domain entity to Prisma Post persistence format.
   *
   * @param post Post domain entity
   * @returns Prisma Post create/update input data
   */
  static toPersistence(post: Post): {
    id: string;
    communityId: string;
    authorId: string;
    title: string;
    content: string;
    isPinned: boolean;
    isSolved: boolean;
    likeCount: number;
    helpfulCount: number;
    commentCount: number;
    viewCount: number;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  } {
    return {
      id: post.getId(),
      communityId: post.getCommunityId(),
      authorId: post.getAuthorId(),
      title: post.getTitle(),
      content: post.getContent(),
      isPinned: post.getIsPinned(),
      isSolved: post.getIsSolved(),
      likeCount: post.getLikeCount(),
      helpfulCount: post.getHelpfulCount(),
      commentCount: post.getCommentCount(),
      viewCount: post.getViewCount(),
      publishedAt: post.getPublishedAt(),
      createdAt: post.getCreatedAt(),
      updatedAt: post.getUpdatedAt(),
      deletedAt: post.getDeletedAt(),
    };
  }
}
