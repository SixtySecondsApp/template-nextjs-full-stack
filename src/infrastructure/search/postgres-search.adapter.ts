import { ISearchAdapter, SearchResults } from "./search.port";
import { Post } from "@/domain/post/post.entity";
import { Comment } from "@/domain/comment/comment.entity";
import { User } from "@/domain/user/user.entity";
import { PostPrismaMapper } from "@/infrastructure/mappers/post-prisma.mapper";
import { CommentPrismaMapper } from "@/infrastructure/mappers/comment-prisma.mapper";
import { UserPrismaMapper } from "@/infrastructure/mappers/user-prisma.mapper";
import { prisma } from "@/lib/prisma";

/**
 * PostgresSearchAdapter
 * PostgreSQL-based search implementation using case-insensitive keyword search.
 *
 * Part of the Infrastructure layer - provides basic search capabilities via Prisma.
 *
 * Key responsibilities:
 * - Search post titles and content using PostgreSQL ILIKE (case-insensitive)
 * - Search user names using PostgreSQL ILIKE
 * - Return domain entities (Post, User), not Prisma types
 * - Apply soft delete filter (deletedAt IS NULL)
 * - Limit results to 20 per category for performance
 * - Order posts by relevance (title matches ranked higher than content matches)
 *
 * V1 Implementation:
 * - Basic keyword search with contains/mode:insensitive
 * - No fuzzy search or typo tolerance
 * - Simple relevance: title match > content match, then newest first
 * - Only searches published posts (publishedAt NOT NULL)
 * - Only searches active community members
 *
 * Future improvements (V2):
 * - Full-text search with PostgreSQL ts_vector
 * - Search ranking/scoring algorithm with TF-IDF
 * - Fuzzy search with trigram similarity (pg_trgm extension)
 * - Filters (date range, author, tags)
 * - Pagination support
 * - Search analytics and query logging
 */
export class PostgresSearchAdapter implements ISearchAdapter {
  private readonly POST_LIMIT = 20;
  private readonly COMMENT_LIMIT = 20;
  private readonly MEMBER_LIMIT = 20;

  /**
   * Search for posts by keyword in title and content.
   * Orders by relevance: title matches first, then newest.
   *
   * @param query Search query string
   * @param communityId Community ID to scope search
   * @returns Array of matching Post domain entities (max 20)
   */
  async searchPosts(query: string, communityId: string): Promise<Post[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    // Search in title and content separately to allow relevance ordering
    const titleMatches = await prisma.post.findMany({
      where: {
        communityId,
        deletedAt: null, // Soft delete filter
        publishedAt: { not: null }, // Only published posts
        title: { contains: query, mode: "insensitive" },
      },
      take: this.POST_LIMIT,
      orderBy: { createdAt: "desc" },
    });

    // If we have enough title matches, return them
    if (titleMatches.length >= this.POST_LIMIT) {
      return titleMatches.map(PostPrismaMapper.toDomain);
    }

    // Search content for additional results
    const contentMatches = await prisma.post.findMany({
      where: {
        communityId,
        deletedAt: null,
        publishedAt: { not: null },
        content: { contains: query, mode: "insensitive" },
        // Exclude posts already found in title search
        id: { notIn: titleMatches.map((p) => p.id) },
      },
      take: this.POST_LIMIT - titleMatches.length,
      orderBy: { createdAt: "desc" },
    });

    // Combine: title matches first, then content matches
    const allPosts = [...titleMatches, ...contentMatches];
    return allPosts.map(PostPrismaMapper.toDomain);
  }

  /**
   * Search for comments by keyword in content.
   * Orders by newest first.
   *
   * @param query Search query string
   * @param communityId Community ID to scope search
   * @returns Array of matching Comment domain entities (max 20)
   */
  async searchComments(
    query: string,
    communityId: string
  ): Promise<Comment[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    // Search comments via Post relationship to filter by community
    const comments = await prisma.comment.findMany({
      where: {
        deletedAt: null, // Soft delete filter
        post: {
          communityId,
          deletedAt: null, // Post also not deleted
          publishedAt: { not: null }, // Only comments on published posts
        },
        content: { contains: query, mode: "insensitive" },
      },
      take: this.COMMENT_LIMIT,
      orderBy: { createdAt: "desc" }, // Newest first
    });

    // Map to Comment domain entities
    return comments.map(CommentPrismaMapper.toDomain);
  }

  /**
   * Search for members by keyword in name.
   * Searches firstName and lastName fields in User table.
   *
   * @param query Search query string
   * @param communityId Community ID to scope search
   * @returns Array of matching User domain entities (max 20)
   */
  async searchMembers(query: string, communityId: string): Promise<User[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    // Search members via CommunityMember relationship
    const members = await prisma.communityMember.findMany({
      where: {
        communityId,
        deletedAt: null, // Soft delete filter
        user: {
          deletedAt: null, // User also not deleted
          OR: [
            { firstName: { contains: query, mode: "insensitive" } },
            { lastName: { contains: query, mode: "insensitive" } },
          ],
        },
      },
      include: {
        user: true, // Include user data for mapping
      },
      take: this.MEMBER_LIMIT,
      orderBy: {
        user: {
          createdAt: "desc", // Newest members first
        },
      },
    });

    // Map to User domain entities
    return members.map((member) =>
      UserPrismaMapper.toDomain(member.user, member)
    );
  }

  /**
   * Perform combined global search across posts, comments, and members.
   * Returns all results with total count.
   *
   * @param query Search query string
   * @param communityId Community ID to scope search
   * @returns SearchResults with posts, comments, members, and total count
   */
  async globalSearch(
    query: string,
    communityId: string
  ): Promise<SearchResults> {
    if (!query || query.trim().length === 0) {
      return {
        posts: [],
        comments: [],
        members: [],
        totalResults: 0,
      };
    }

    // Execute all searches in parallel for performance
    const [posts, comments, members] = await Promise.all([
      this.searchPosts(query, communityId),
      this.searchComments(query, communityId),
      this.searchMembers(query, communityId),
    ]);

    return {
      posts,
      comments,
      members,
      totalResults: posts.length + comments.length + members.length,
    };
  }
}
