import { IPostRepository } from "@/ports/repositories";
import { Post } from "@/domain/post/post.entity";
import { PostPrismaMapper } from "@/infrastructure/mappers/post-prisma.mapper";
import { prisma } from "@/lib/prisma";

/**
 * Prisma implementation of IPostRepository.
 *
 * Part of the Infrastructure layer - implements the repository port using Prisma ORM.
 *
 * Key responsibilities:
 * - Execute database operations via Prisma client
 * - Apply soft delete filter to all find operations (deletedAt IS NULL)
 * - Use PostPrismaMapper to convert between domain entities and Prisma models
 * - Handle database errors and convert to domain-appropriate errors
 * - Support pinned posts ordering (pinned first, then by createdAt desc)
 */
export class PostRepositoryPrisma implements IPostRepository {
  /**
   * Find a post by its unique ID.
   * Excludes archived posts by default.
   */
  async findById(id: string): Promise<Post | null> {
    const prismaPost = await prisma.post.findFirst({
      where: {
        id,
        deletedAt: null, // Soft delete filter
      },
    });

    if (!prismaPost) {
      return null;
    }

    return PostPrismaMapper.toDomain(prismaPost);
  }

  /**
   * Find all posts in a specific community.
   * Orders by isPinned DESC, then createdAt DESC (pinned posts first).
   *
   * @param communityId Community ID
   * @param includeArchived Optional flag to include archived posts
   */
  async findByCommunityId(
    communityId: string,
    includeArchived = false
  ): Promise<Post[]> {
    const prismaPosts = await prisma.post.findMany({
      where: {
        communityId,
        ...(includeArchived ? {} : { deletedAt: null }), // Soft delete filter
      },
      orderBy: [
        { isPinned: "desc" }, // Pinned posts first
        { createdAt: "desc" }, // Then by creation date
      ],
    });

    return prismaPosts.map(PostPrismaMapper.toDomain);
  }

  /**
   * Find all posts by a specific author.
   * Excludes archived posts by default.
   */
  async findByAuthorId(authorId: string): Promise<Post[]> {
    const prismaPosts = await prisma.post.findMany({
      where: {
        authorId,
        deletedAt: null, // Soft delete filter
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return prismaPosts.map(PostPrismaMapper.toDomain);
  }

  /**
   * Create a new post.
   *
   * @param post Post domain entity
   */
  async create(post: Post): Promise<Post> {
    try {
      const data = PostPrismaMapper.toPersistence(post);

      const created = await prisma.post.create({
        data: {
          id: data.id,
          communityId: data.communityId,
          authorId: data.authorId,
          title: data.title,
          content: data.content,
          isPinned: data.isPinned,
          isSolved: data.isSolved,
          likeCount: data.likeCount,
          helpfulCount: data.helpfulCount,
          commentCount: data.commentCount,
          viewCount: data.viewCount,
          publishedAt: data.publishedAt,
        },
      });

      return PostPrismaMapper.toDomain(created);
    } catch (error) {
      // Handle foreign key constraint violations
      if (
        error instanceof Error &&
        error.message.includes("Foreign key constraint")
      ) {
        if (error.message.includes("communityId")) {
          throw new Error("Community not found");
        }
        if (error.message.includes("authorId")) {
          throw new Error("Author not found");
        }
      }
      throw error;
    }
  }

  /**
   * Update an existing post.
   *
   * @param post Post domain entity
   */
  async update(post: Post): Promise<Post> {
    try {
      const data = PostPrismaMapper.toPersistence(post);

      const updated = await prisma.post.update({
        where: { id: post.getId() },
        data: {
          title: data.title,
          content: data.content,
          isPinned: data.isPinned,
          isSolved: data.isSolved,
          likeCount: data.likeCount,
          helpfulCount: data.helpfulCount,
          commentCount: data.commentCount,
          viewCount: data.viewCount,
          publishedAt: data.publishedAt,
          updatedAt: data.updatedAt,
        },
      });

      return PostPrismaMapper.toDomain(updated);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Record to update not found")
      ) {
        throw new Error("Post not found or is archived");
      }
      throw error;
    }
  }

  /**
   * Archive (soft delete) a post by setting deletedAt timestamp.
   *
   * @param id Post ID
   */
  async archive(id: string): Promise<void> {
    try {
      const post = await prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      if (post.deletedAt !== null) {
        throw new Error("Post is already archived");
      }

      await prisma.post.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Record to update not found")
      ) {
        throw new Error("Post not found");
      }
      throw error;
    }
  }

  /**
   * Restore a soft-deleted post by clearing deletedAt timestamp.
   *
   * @param id Post ID
   */
  async restore(id: string): Promise<void> {
    try {
      const post = await prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      if (post.deletedAt === null) {
        throw new Error("Post is not archived");
      }

      await prisma.post.update({
        where: { id },
        data: { deletedAt: null },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Record to update not found")
      ) {
        throw new Error("Post not found");
      }
      throw error;
    }
  }

  /**
   * Permanently delete a post from the database.
   * This operation is irreversible - use sparingly.
   *
   * @param id Post ID
   */
  async delete(id: string): Promise<void> {
    try {
      await prisma.post.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Record to delete does not exist")
      ) {
        throw new Error("Post not found");
      }
      throw error;
    }
  }
}
