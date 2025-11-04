import { z } from "zod";

/**
 * Zod validation schemas for Post Draft API endpoints.
 * These schemas validate request bodies for draft operations.
 */

/**
 * Schema for saving a post draft.
 * Drafts can be created or updated with partial content.
 * Validates:
 * - postId: optional, valid UUID (for updating existing draft)
 * - communityId: required, valid UUID
 * - authorId: required, valid UUID
 * - title: optional, 1-200 characters
 * - content: optional, minimum 1 character
 */
export const SaveDraftSchema = z.object({
  postId: z.string().uuid("Post ID must be a valid UUID").optional(),
  communityId: z.string().uuid("Community ID must be a valid UUID"),
  authorId: z.string().uuid("Author ID must be a valid UUID"),
  title: z
    .string()
    .min(1, "Title must be at least 1 character")
    .max(200, "Title must not exceed 200 characters")
    .optional(),
  content: z.string().min(1, "Content must be at least 1 character").optional(),
});

// Type exports for use in API routes
export type SaveDraftInput = z.infer<typeof SaveDraftSchema>;
