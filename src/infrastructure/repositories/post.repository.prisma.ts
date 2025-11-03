import { IPostRepository } from "@/ports/repositories";
import { Post } from "@/domain/post/post.entity";
import { ContentVersion } from "@/domain/content-version/content-version.entity";
import { PostPrismaMapper } from "@/infrastructure/mappers/post-prisma.mapper";
import { ContentVersionPrismaMapper } from "@/infrastructure/mappers/content-version-prisma.mapper";
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

  /**
   * Create a post with its initial content version atomically.
   * Uses Prisma transaction to ensure both records are created together.
   *
   * This method ensures data consistency:
   * - Post and initial version are created in a single transaction
   * - If version creation fails, post creation is rolled back
   * - If post creation fails, version creation is rolled back
   *
   * Use case: Creating a new post with version history tracking enabled.
   *
   * @param post Post domain entity
   * @param version ContentVersion domain entity (version 1)
   */
  async createWithVersion(
    post: Post,
    version: ContentVersion
  ): Promise<Post> {
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Create post first
        const postData = PostPrismaMapper.toPersistence(post);
        const createdPost = await tx.post.create({
          data: {
            id: postData.id,
            communityId: postData.communityId,
            authorId: postData.authorId,
            title: postData.title,
            content: postData.content,
            isPinned: postData.isPinned,
            isSolved: postData.isSolved,
            likeCount: postData.likeCount,
            helpfulCount: postData.helpfulCount,
            commentCount: postData.commentCount,
            viewCount: postData.viewCount,
            publishedAt: postData.publishedAt,
          },
        });

        // Create initial version
        const versionData = ContentVersionPrismaMapper.toPersistence(version);
        await tx.contentVersion.create({
          data: {
            id: versionData.id,
            contentType: versionData.contentType,
            contentId: versionData.contentId,
            content: versionData.content,
            versionNumber: versionData.versionNumber,
            createdAt: versionData.createdAt,
          },
        });

        return createdPost;
      });

      return PostPrismaMapper.toDomain(result);
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
   * Update a post and create a new content version atomically.
   * Uses Prisma transaction to ensure both operations succeed or fail together.
   *
   * This method ensures data consistency:
   * - Post update and new version are created in a single transaction
   * - If version creation fails, post update is rolled back
   * - If post update fails, version creation is rolled back
   *
   * Use case: Updating post content with automatic version history tracking.
   *
   * @param post Post domain entity (with updated content)
   * @param version ContentVersion domain entity (incremented version number)
   */
  async updateWithVersion(
    post: Post,
    version: ContentVersion
  ): Promise<Post> {
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Update post first
        const postData = PostPrismaMapper.toPersistence(post);
        const updatedPost = await tx.post.update({
          where: { id: post.getId() },
          data: {
            title: postData.title,
            content: postData.content,
            isPinned: postData.isPinned,
            isSolved: postData.isSolved,
            likeCount: postData.likeCount,
            helpfulCount: postData.helpfulCount,
            commentCount: postData.commentCount,
            viewCount: postData.viewCount,
            publishedAt: postData.publishedAt,
            updatedAt: postData.updatedAt,
          },
        });

        // Create new version
        const versionData = ContentVersionPrismaMapper.toPersistence(version);
        await tx.contentVersion.create({
          data: {
            id: versionData.id,
            contentType: versionData.contentType,
            contentId: versionData.contentId,
            content: versionData.content,
            versionNumber: versionData.versionNumber,
            createdAt: versionData.createdAt,
          },
        });

        return updatedPost;
      });

      return PostPrismaMapper.toDomain(result);
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
}
