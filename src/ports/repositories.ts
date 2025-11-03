/**
 * Repository Interfaces (Ports)
 * Define contracts that infrastructure implementations must satisfy
 * Using domain entities, NOT DTOs or Prisma types
 */

import { User } from "@/domain/user/user.entity";
import { Community } from "@/domain/community/community.entity";

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
