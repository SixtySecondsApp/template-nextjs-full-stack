import { PrismaClient } from "@/generated/prisma";
import { Comment } from "@/domain/comment/comment.entity";
import { ICommentRepository } from "@/application/ports/comment-repository.interface";
import { CommentPrismaMapper } from "@/infrastructure/mappers/comment-prisma.mapper";

/**
 * CommentRepositoryPrisma - Prisma implementation of ICommentRepository.
 * Handles Comment persistence using Prisma ORM.
 *
 * Key responsibilities:
 * - Implement repository interface using Prisma
 * - Enforce soft delete filters (deletedAt = null)
 * - Support threaded comments (max 2 levels)
 * - Prevent N+1 queries with includes
 * - Map between domain entities and Prisma models
 * - Handle database errors gracefully
 */
export class CommentRepositoryPrisma implements ICommentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(comment: Comment): Promise<Comment> {
    try {
      const persistenceData = CommentPrismaMapper.toPersistence(comment);

      const created = await this.prisma.comment.create({
        data: persistenceData,
      });

      return CommentPrismaMapper.toDomain(created);
    } catch (error) {
      throw new Error(
        `Failed to create comment: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async findById(id: string): Promise<Comment | null> {
    try {
      const result = await this.prisma.comment.findFirst({
        where: {
          id,
          deletedAt: null, // Soft delete filter
        },
      });

      return result ? CommentPrismaMapper.toDomain(result) : null;
    } catch (error) {
      throw new Error(
        `Failed to find comment by ID: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async findByPost(postId: string): Promise<Comment[]> {
    try {
      // Fetch top-level comments (parentId = null) with nested replies
      const results = await this.prisma.comment.findMany({
        where: {
          postId,
          parentId: null, // Only top-level comments
          deletedAt: null, // Soft delete filter
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
          createdAt: "desc", // Latest comments first
        },
      });

      return results.map(CommentPrismaMapper.toDomain);
    } catch (error) {
      throw new Error(
        `Failed to find comments by post: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async findReplies(parentId: string): Promise<Comment[]> {
    try {
      const results = await this.prisma.comment.findMany({
        where: {
          parentId,
          deletedAt: null, // Soft delete filter
        },
        orderBy: {
          createdAt: "asc", // Oldest replies first
        },
      });

      return results.map(CommentPrismaMapper.toDomain);
    } catch (error) {
      throw new Error(
        `Failed to find replies: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async update(comment: Comment): Promise<Comment> {
    try {
      const persistenceData = CommentPrismaMapper.toPersistence(comment);

      const updated = await this.prisma.comment.update({
        where: { id: comment.getId() },
        data: persistenceData,
      });

      return CommentPrismaMapper.toDomain(updated);
    } catch (error) {
      throw new Error(
        `Failed to update comment: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async softDelete(id: string): Promise<void> {
    try {
      await this.prisma.comment.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      throw new Error(
        `Failed to soft delete comment: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async restore(id: string): Promise<void> {
    try {
      await this.prisma.comment.update({
        where: { id },
        data: { deletedAt: null },
      });
    } catch (error) {
      throw new Error(
        `Failed to restore comment: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async countByPost(postId: string): Promise<number> {
    try {
      return await this.prisma.comment.count({
        where: {
          postId,
          deletedAt: null, // Only count non-deleted comments
        },
      });
    } catch (error) {
      throw new Error(
        `Failed to count comments: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}
