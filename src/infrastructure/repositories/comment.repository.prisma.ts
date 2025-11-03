import { ICommentRepository } from "@/ports/repositories";
import { Comment } from "@/domain/comment/comment.entity";
import { CommentPrismaMapper } from "@/infrastructure/mappers/comment-prisma.mapper";
import { prisma } from "@/lib/prisma";

/**
 * Prisma implementation of ICommentRepository.
 *
 * Part of the Infrastructure layer - implements the repository port using Prisma ORM.
 *
 * Key responsibilities:
 * - Execute database operations via Prisma client
 * - Apply soft delete filter to all find operations (deletedAt IS NULL)
 * - Use CommentPrismaMapper to convert between domain entities and Prisma models
 * - Handle database errors and convert to domain-appropriate errors
 * - Support comment threading via parentId (max 2 levels in V1)
 */
export class CommentRepositoryPrisma implements ICommentRepository {
  /**
   * Find a comment by its unique ID.
   * Excludes archived comments by default.
   */
  async findById(id: string): Promise<Comment | null> {
    const prismaComment = await prisma.comment.findFirst({
      where: {
        id,
        deletedAt: null, // Soft delete filter
      },
    });

    if (!prismaComment) {
      return null;
    }

    return CommentPrismaMapper.toDomain(prismaComment);
  }

  /**
   * Find all comments for a specific post.
   * Orders by createdAt ASC (oldest first).
   *
   * @param postId Post ID
   * @param includeArchived Optional flag to include archived comments
   */
  async findByPostId(
    postId: string,
    includeArchived = false
  ): Promise<Comment[]> {
    const prismaComments = await prisma.comment.findMany({
      where: {
        postId,
        ...(includeArchived ? {} : { deletedAt: null }), // Soft delete filter
      },
      orderBy: {
        createdAt: "asc", // Oldest comments first for thread context
      },
    });

    return prismaComments.map(CommentPrismaMapper.toDomain);
  }

  /**
   * Find all comments by a specific author.
   * Excludes archived comments by default.
   */
  async findByAuthorId(authorId: string): Promise<Comment[]> {
    const prismaComments = await prisma.comment.findMany({
      where: {
        authorId,
        deletedAt: null, // Soft delete filter
      },
      orderBy: {
        createdAt: "desc", // Most recent first for author's comment list
      },
    });

    return prismaComments.map(CommentPrismaMapper.toDomain);
  }

  /**
   * Find direct replies to a comment (threading support).
   * Excludes archived comments by default.
   *
   * @param parentId Parent comment ID
   */
  async findReplies(parentId: string): Promise<Comment[]> {
    const prismaComments = await prisma.comment.findMany({
      where: {
        parentId,
        deletedAt: null, // Soft delete filter
      },
      orderBy: {
        createdAt: "asc", // Oldest replies first
      },
    });

    return prismaComments.map(CommentPrismaMapper.toDomain);
  }

  /**
   * Create a new comment.
   *
   * @param comment Comment domain entity
   */
  async create(comment: Comment): Promise<Comment> {
    try {
      const data = CommentPrismaMapper.toPersistence(comment);

      const created = await prisma.comment.create({
        data: {
          id: data.id,
          postId: data.postId,
          authorId: data.authorId,
          parentId: data.parentId,
          content: data.content,
          likeCount: data.likeCount,
          helpfulCount: data.helpfulCount,
        },
      });

      return CommentPrismaMapper.toDomain(created);
    } catch (error) {
      // Handle foreign key constraint violations
      if (
        error instanceof Error &&
        error.message.includes("Foreign key constraint")
      ) {
        if (error.message.includes("postId")) {
          throw new Error("Post not found");
        }
        if (error.message.includes("authorId")) {
          throw new Error("Author not found");
        }
        if (error.message.includes("parentId")) {
          throw new Error("Parent comment not found");
        }
      }
      throw error;
    }
  }

  /**
   * Update an existing comment.
   *
   * @param comment Comment domain entity
   */
  async update(comment: Comment): Promise<Comment> {
    try {
      const data = CommentPrismaMapper.toPersistence(comment);

      const updated = await prisma.comment.update({
        where: { id: comment.getId() },
        data: {
          content: data.content,
          likeCount: data.likeCount,
          helpfulCount: data.helpfulCount,
          updatedAt: data.updatedAt,
        },
      });

      return CommentPrismaMapper.toDomain(updated);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Record to update not found")
      ) {
        throw new Error("Comment not found or is archived");
      }
      throw error;
    }
  }

  /**
   * Archive (soft delete) a comment by setting deletedAt timestamp.
   *
   * @param id Comment ID
   */
  async archive(id: string): Promise<void> {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw new Error("Comment not found");
      }

      if (comment.deletedAt !== null) {
        throw new Error("Comment is already archived");
      }

      await prisma.comment.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Record to update not found")
      ) {
        throw new Error("Comment not found");
      }
      throw error;
    }
  }

  /**
   * Restore a soft-deleted comment by clearing deletedAt timestamp.
   *
   * @param id Comment ID
   */
  async restore(id: string): Promise<void> {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw new Error("Comment not found");
      }

      if (comment.deletedAt === null) {
        throw new Error("Comment is not archived");
      }

      await prisma.comment.update({
        where: { id },
        data: { deletedAt: null },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Record to update not found")
      ) {
        throw new Error("Comment not found");
      }
      throw error;
    }
  }

  /**
   * Permanently delete a comment from the database.
   * This operation is irreversible - use sparingly.
   *
   * Note: Due to cascade delete, deleting a parent comment will also
   * delete all its replies (defined in Prisma schema).
   *
   * @param id Comment ID
   */
  async delete(id: string): Promise<void> {
    try {
      await prisma.comment.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Record to delete does not exist")
      ) {
        throw new Error("Comment not found");
      }
      throw error;
    }
  }
}
