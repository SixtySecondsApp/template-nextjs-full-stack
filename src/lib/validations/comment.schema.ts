import { z } from "zod";

/**
 * Zod validation schemas for Comment API endpoints.
 * These schemas validate request bodies before passing to use cases.
 */

/**
 * Schema for creating a new comment.
 * Supports threaded comments with parentId for nesting.
 * Validates:
 * - postId: required, valid UUID
 * - authorId: required, valid UUID
 * - parentId: optional, valid UUID (for threaded replies)
 * - content: required, minimum 1 character
 */
export const CreateCommentSchema = z.object({
  postId: z.string().uuid("Post ID must be a valid UUID"),
  authorId: z.string().uuid("Author ID must be a valid UUID"),
  parentId: z.string().uuid("Parent ID must be a valid UUID").optional(),
  content: z.string().min(1, "Content is required"),
});

/**
 * Schema for updating a comment.
 * Only content can be updated (not postId, authorId, or parentId).
 * Validates:
 * - content: required, minimum 1 character
 */
export const UpdateCommentSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

// Type exports for use in API routes
export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>;
