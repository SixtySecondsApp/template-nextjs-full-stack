import { z } from "zod";
import { Role } from "@/domain/shared/role.enum";

/**
 * Zod validation schemas for User API endpoints.
 * These schemas validate request bodies before passing to use cases.
 */

/**
 * Schema for creating a new user.
 * Validates:
 * - email: required, valid email format, max 255 chars
 * - name: optional, 1-100 chars when provided
 * - role: valid Role enum value
 * - communityId: required, non-empty string
 * - avatarUrl: optional, valid URL format
 */
export const CreateUserSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(255, "Email must not exceed 255 characters"),
  name: z
    .string()
    .min(1, "Name must be at least 1 character")
    .max(100, "Name must not exceed 100 characters")
    .nullable()
    .optional(),
  role: z.nativeEnum(Role),
  communityId: z.string().min(1, "Community ID is required"),
  avatarUrl: z
    .string()
    .url("Invalid avatar URL format")
    .nullable()
    .optional(),
});

/**
 * Schema for updating an existing user.
 * All fields are optional to support partial updates.
 * Validates:
 * - email: optional, valid email format, max 255 chars
 * - name: optional, 1-100 chars when provided
 * - avatarUrl: optional, valid URL format
 */
export const UpdateUserSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .max(255, "Email must not exceed 255 characters")
    .optional(),
  name: z
    .string()
    .min(1, "Name must be at least 1 character")
    .max(100, "Name must not exceed 100 characters")
    .nullable()
    .optional(),
  avatarUrl: z
    .string()
    .url("Invalid avatar URL format")
    .nullable()
    .optional(),
});

/**
 * Schema for changing a user's role.
 * Validates:
 * - role: required, valid Role enum value
 */
export const ChangeUserRoleSchema = z.object({
  role: z.nativeEnum(Role),
});

// Type exports for use in API routes
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type ChangeUserRoleInput = z.infer<typeof ChangeUserRoleSchema>;
