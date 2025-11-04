import { PrismaClient } from "@/generated/prisma";
import { Post } from "@/domain/post/post.entity";
import {
  IPostRepository,
  PostFilter,
} from "@/application/ports/post-repository.interface";
import { PostPrismaMapper } from "@/infrastructure/mappers/post-prisma.mapper";

/**
 * PostRepositoryPrisma - Prisma implementation of IPostRepository.
 * Handles Post persistence using Prisma ORM.
 *
 * Key responsibilities:
 * - Implement repository interface using Prisma
 * - Enforce soft delete filters (deletedAt = null)
 * - Prevent N+1 queries with includes
 * - Map between domain entities and Prisma models
 * - Handle database errors gracefully
 */
export class PostRepositoryPrisma implements IPostRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(post: Post): Promise<Post> {
    try {
      const persistenceData = PostPrismaMapper.toPersistence(post);

      const created = await this.prisma.post.create({
        data: persistenceData,
      });

      return PostPrismaMapper.toDomain(created);
    } catch (error) {
      throw new Error(
        `Failed to create post: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async findById(id: string): Promise<Post | null> {
    try {
      const result = await this.prisma.post.findFirst({
        where: {
          id,
          deletedAt: null, // Soft delete filter
        },
      });

      return result ? PostPrismaMapper.toDomain(result) : null;
    } catch (error) {
      throw new Error(
        `Failed to find post by ID: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async findByIdWithComments(id: string): Promise<Post | null> {
    try {
      const result = await this.prisma.post.findFirst({
        where: {
          id,
          deletedAt: null, // Soft delete filter
        },
        include: {
          comments: {
            where: {
              deletedAt: null, // Only non-deleted comments
            },
            include: {
              replies: {
                where: {
                  deletedAt: null, // Only non-deleted replies
                },
                orderBy: {
                  createdAt: "asc",
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      return result ? PostPrismaMapper.toDomain(result) : null;
    } catch (error) {
      throw new Error(
        `Failed to find post with comments: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async findByCommunity(
    communityId: string,
    filter?: PostFilter
  ): Promise<Post[]> {
    try {
      const results = await this.prisma.post.findMany({
        where: {
          communityId,
          deletedAt: null, // Soft delete filter
          ...(filter?.isPinned !== undefined && { isPinned: filter.isPinned }),
          ...(filter?.isSolved !== undefined && { isSolved: filter.isSolved }),
          ...(filter?.isDraft !== undefined && {
            publishedAt: filter.isDraft ? null : { not: null },
          }),
          ...(filter?.authorId && { authorId: filter.authorId }),
        },
        orderBy: {
          [filter?.sortBy ?? "createdAt"]: filter?.sortOrder ?? "desc",
        },
        take: filter?.limit,
        skip: filter?.offset,
      });

      return results.map(PostPrismaMapper.toDomain);
    } catch (error) {
      throw new Error(
        `Failed to find posts by community: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async update(post: Post): Promise<Post> {
    try {
      const persistenceData = PostPrismaMapper.toPersistence(post);

      const updated = await this.prisma.post.update({
        where: { id: post.getId() },
        data: persistenceData,
      });

      return PostPrismaMapper.toDomain(updated);
    } catch (error) {
      throw new Error(
        `Failed to update post: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async softDelete(id: string): Promise<void> {
    try {
      await this.prisma.post.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      throw new Error(
        `Failed to soft delete post: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async restore(id: string): Promise<void> {
    try {
      await this.prisma.post.update({
        where: { id },
        data: { deletedAt: null },
      });
    } catch (error) {
      throw new Error(
        `Failed to restore post: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async incrementViewCount(id: string): Promise<void> {
    try {
      await this.prisma.post.update({
        where: { id },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      throw new Error(
        `Failed to increment view count: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async updateCounts(postId: string): Promise<void> {
    try {
      // Count actual comments (excluding deleted)
      const commentCount = await this.prisma.comment.count({
        where: {
          postId,
          deletedAt: null,
        },
      });

      // Update the post with recalculated counts
      await this.prisma.post.update({
        where: { id: postId },
        data: {
          commentCount,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new Error(
        `Failed to update post counts: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}
