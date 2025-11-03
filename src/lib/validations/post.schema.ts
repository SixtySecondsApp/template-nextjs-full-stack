import { z } from "zod";

/**
 * Zod validation schemas for Post API endpoints.
 * These schemas validate request bodies before passing to use cases.
 */

/**
 * Schema for creating a new post.
 * Posts are created in DRAFT status by default.
 * Validates:
 * - communityId: required, valid UUID
 * - authorId: required, valid UUID
 * - title: required, 3-200 characters
 * - content: required, minimum 10 characters
 */
export const CreatePostSchema = z.object({
  communityId: z.string().uuid("Community ID must be a valid UUID"),
  authorId: z.string().uuid("Author ID must be a valid UUID"),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

/**
 * Schema for updating a post.
 * All fields are optional to support partial updates.
 * Only title and content can be updated (not communityId or authorId).
 * Validates:
 * - title: optional, 3-200 characters
 * - content: optional, minimum 10 characters
 */
export const UpdatePostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .optional(),
  content: z.string().min(10, "Content must be at least 10 characters").optional(),
});

/**
 * Schema for publishing a post.
 * Changes status from DRAFT to PUBLISHED.
 * Validates:
 * - postId: required, valid UUID
 */
export const PublishPostSchema = z.object({
  postId: z.string().uuid("Post ID must be a valid UUID"),
});

/**
 * Schema for pinning/unpinning a post.
 * Validates:
 * - postId: required, valid UUID
 * - isPinned: required, boolean flag
 */
export const PinPostSchema = z.object({
  postId: z.string().uuid("Post ID must be a valid UUID"),
  isPinned: z.boolean(),
});

/**
 * Schema for marking a post as solved.
 * Used for Q&A/support posts.
 * Validates:
 * - postId: required, valid UUID
 */
export const MarkSolvedSchema = z.object({
  postId: z.string().uuid("Post ID must be a valid UUID"),
});

// Type exports for use in API routes
export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;
export type PublishPostInput = z.infer<typeof PublishPostSchema>;
export type PinPostInput = z.infer<typeof PinPostSchema>;
export type MarkSolvedInput = z.infer<typeof MarkSolvedSchema>;
