/**
 * Repository Interfaces (Ports)
 * Define contracts that infrastructure implementations must satisfy
 * Using domain entities, NOT DTOs or Prisma types
 */

import { User } from "@/domain/user/user.entity";
import { Community } from "@/domain/community/community.entity";
import { Post } from "@/domain/post/post.entity";
import { Comment } from "@/domain/comment/comment.entity";

/**
 * User Repository Interface
 * Defines persistence operations for User aggregate
 */
export interface IUserRepository {
  /**
   * Create a new user
   */
  create(user: User): Promise<User>;

  /**
   * Update an existing user
   */
  update(user: User): Promise<User>;

  /**
   * Archive (soft delete) a user
   */
  archive(id: string): Promise<void>;

  /**
   * Restore an archived user
   */
  restore(id: string): Promise<void>;

  /**
   * Permanently delete a user (use sparingly)
   */
  delete(id: string): Promise<void>;

  /**
   * Find user by ID (excludes archived by default)
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find user by email (excludes archived by default)
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Find all users in a community (excludes archived by default)
   */
  findByCommunityId(communityId: string): Promise<User[]>;

  /**
   * Find all users (excludes archived by default)
   */
  findAll(): Promise<User[]>;
}

/**
 * Community Repository Interface
 * Defines persistence operations for Community aggregate
 */
export interface ICommunityRepository {
  /**
   * Create a new community
   */
  create(community: Community): Promise<Community>;

  /**
   * Update an existing community
   */
  update(community: Community): Promise<Community>;

  /**
   * Archive (soft delete) a community
   */
  archive(id: string): Promise<void>;

  /**
   * Restore an archived community
   */
  restore(id: string): Promise<void>;

  /**
   * Permanently delete a community (use sparingly)
   */
  delete(id: string): Promise<void>;

  /**
   * Find community by ID (excludes archived by default)
   */
  findById(id: string): Promise<Community | null>;

  /**
   * Find community by owner ID (excludes archived by default)
   */
  findByOwnerId(ownerId: string): Promise<Community | null>;

  /**
   * Find all communities (excludes archived by default)
   */
  findAll(): Promise<Community[]>;
}

/**
 * Post Repository Interface
 * Defines persistence operations for Post aggregate
 */
export interface IPostRepository {
  /**
   * Find post by ID (excludes archived by default)
   */
  findById(id: string): Promise<Post | null>;

  /**
   * Find all posts in a community (excludes archived by default)
   * @param communityId Community ID
   * @param includeArchived Optional flag to include archived posts
   */
  findByCommunityId(
    communityId: string,
    includeArchived?: boolean
  ): Promise<Post[]>;

  /**
   * Find all posts by author (excludes archived by default)
   */
  findByAuthorId(authorId: string): Promise<Post[]>;

  /**
   * Create a new post
   */
  create(post: Post): Promise<Post>;

  /**
   * Update an existing post
   */
  update(post: Post): Promise<Post>;

  /**
   * Archive (soft delete) a post
   */
  archive(id: string): Promise<void>;

  /**
   * Restore an archived post
   */
  restore(id: string): Promise<void>;

  /**
   * Permanently delete a post (use sparingly)
   */
  delete(id: string): Promise<void>;
}

/**
 * Comment Repository Interface
 * Defines persistence operations for Comment aggregate
 */
export interface ICommentRepository {
  /**
   * Find comment by ID (excludes archived by default)
   */
  findById(id: string): Promise<Comment | null>;

  /**
   * Find all comments for a post (excludes archived by default)
   * @param postId Post ID
   * @param includeArchived Optional flag to include archived comments
   */
  findByPostId(postId: string, includeArchived?: boolean): Promise<Comment[]>;

  /**
   * Find all comments by author (excludes archived by default)
   */
  findByAuthorId(authorId: string): Promise<Comment[]>;

  /**
   * Find direct replies to a comment (excludes archived by default)
   * @param parentId Parent comment ID
   */
  findReplies(parentId: string): Promise<Comment[]>;

  /**
   * Create a new comment
   */
  create(comment: Comment): Promise<Comment>;

  /**
   * Update an existing comment
   */
  update(comment: Comment): Promise<Comment>;

  /**
   * Archive (soft delete) a comment
   */
  archive(id: string): Promise<void>;

  /**
   * Restore an archived comment
   */
  restore(id: string): Promise<void>;

  /**
   * Permanently delete a comment (use sparingly)
   */
  delete(id: string): Promise<void>;
}
