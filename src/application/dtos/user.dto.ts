/**
 * User Data Transfer Objects
 * Plain TypeScript interfaces for API communication
 * NO domain logic, NO Prisma types
 */

import { Role } from "@/domain/shared/role.enum";

/**
 * Full User DTO for API responses
 */
export interface UserDto {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  communityId: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create User DTO for API requests
 */
export interface CreateUserDto {
  email: string;
  name?: string | null;
  role: Role;
  communityId: string;
  avatarUrl?: string | null;
}

/**
 * Update User DTO for API requests
 */
export interface UpdateUserDto {
  email?: string;
  name?: string | null;
  avatarUrl?: string | null;
}

/**
 * Change Role DTO for API requests
 */
export interface ChangeRoleDto {
  role: Role;
}
