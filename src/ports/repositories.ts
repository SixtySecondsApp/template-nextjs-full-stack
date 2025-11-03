/**
 * Repository Interfaces (Ports)
 * Define contracts that infrastructure implementations must satisfy
 * Using domain entities, NOT DTOs or Prisma types
 */

import { User } from "@/domain/user/user.entity";
import { Community } from "@/domain/community/community.entity";
import { Post } from "@/domain/post/post.entity";
import { Comment } from "@/domain/comment/comment.entity";
import { ContentVersion } from "@/domain/content-version/content-version.entity";
import { Notification } from "@/domain/notification/notification.entity";

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

/**
 * ContentVersion Repository Interface
 * Defines persistence operations for ContentVersion aggregate
 */
export interface IContentVersionRepository {
  /**
   * Create a new content version
   */
  create(version: ContentVersion): Promise<ContentVersion>;

  /**
   * Find version by ID
   */
  findById(id: string): Promise<ContentVersion | null>;

  /**
   * Find all versions for a specific piece of content (post or comment)
   * Ordered by versionNumber DESC (latest first)
   */
  findByContentId(contentId: string): Promise<ContentVersion[]>;

  /**
   * Find specific version by content ID and version number
   */
  findByContentIdAndVersion(
    contentId: string,
    versionNumber: number
  ): Promise<ContentVersion | null>;

  /**
   * Get the latest version for a specific piece of content
   */
  getLatestVersion(contentId: string): Promise<ContentVersion | null>;

  /**
   * Permanently delete a version (use sparingly)
   * Note: Versions are typically kept for audit trail
   */
  delete(id: string): Promise<void>;
}

/**
 * Notification Repository Interface
 * Defines persistence operations for Notification aggregate
 */
export interface INotificationRepository {
  /**
   * Create a new notification
   */
  create(notification: Notification): Promise<Notification>;

  /**
   * Find notification by ID (excludes archived by default)
   */
  findById(id: string): Promise<Notification | null>;

  /**
   * Find all notifications for a user
   * @param userId User ID
   * @param includeRead Optional flag to include read notifications
   */
  findByUserId(
    userId: string,
    includeRead?: boolean
  ): Promise<Notification[]>;

  /**
   * Count unread notifications for a user
   */
  findUnreadCount(userId: string): Promise<number>;

  /**
   * Mark single notification as read
   */
  markAsRead(id: string): Promise<void>;

  /**
   * Mark all notifications as read for a user
   */
  markAllAsRead(userId: string): Promise<void>;

  /**
   * Archive (soft delete) a notification
   */
  archive(id: string): Promise<void>;
}

/**
 * Course Repository Interface
 * Defines persistence operations for Course aggregate
 * Note: Requires Course domain entity to be created
 */
export interface ICourseRepository {
  create(course: any): Promise<any>; // TODO: Replace 'any' with Course entity
  update(course: any): Promise<any>;
  archive(id: string): Promise<void>;
  restore(id: string): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<any | null>;
  findByCommunityId(communityId: string): Promise<any[]>;
  findByInstructorId(instructorId: string): Promise<any[]>;
  findAll(): Promise<any[]>;
}

/**
 * Lesson Repository Interface
 * Defines persistence operations for Lesson aggregate
 * Note: Requires Lesson domain entity to be created
 */
export interface ILessonRepository {
  create(lesson: any): Promise<any>; // TODO: Replace 'any' with Lesson entity
  update(lesson: any): Promise<any>;
  archive(id: string): Promise<void>;
  restore(id: string): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<any | null>;
  findByCourseId(courseId: string): Promise<any[]>;
  reorder(lessons: Array<{ id: string; order: number }>): Promise<void>;
}

/**
 * CourseProgress Repository Interface
 * Defines persistence operations for CourseProgress aggregate
 * Note: Requires CourseProgress domain entity to be created
 */
export interface ICourseProgressRepository {
  create(progress: any): Promise<any>; // TODO: Replace 'any' with CourseProgress entity
  update(progress: any): Promise<any>;
  findById(id: string): Promise<any | null>;
  findByUserIdAndCourseId(
    userId: string,
    courseId: string
  ): Promise<any | null>;
  findByUserId(userId: string): Promise<any[]>;
  findByCourseId(courseId: string): Promise<any[]>;
}

/**
 * Certificate Repository Interface
 * Defines persistence operations for Certificate aggregate
 * Note: Requires Certificate domain entity to be created
 */
export interface ICertificateRepository {
  create(certificate: any): Promise<any>; // TODO: Replace 'any' with Certificate entity
  update(certificate: any): Promise<any>;
  findById(id: string): Promise<any | null>;
  findByVerificationCode(code: string): Promise<any | null>;
  findByUserId(userId: string): Promise<any[]>;
  findByUserIdAndCourseId(
    userId: string,
    courseId: string
  ): Promise<any | null>;
}

/**
 * Export infrastructure port interfaces
 * These are re-exported from infrastructure layer for convenience
 */
export * from "../infrastructure/search/search.port";
export * from "../infrastructure/email/email.port";
export * from "../infrastructure/pdf/pdf.port";
export * from "../infrastructure/payment/stripe.port";
