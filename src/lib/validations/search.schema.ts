import { z } from "zod";

/**
 * Zod validation schemas for Search API endpoints.
 * These schemas validate query parameters for search operations.
 */

/**
 * Schema for search query parameters.
 * Validates:
 * - q: required, minimum 1 character search query
 * - type: optional, one of 'posts', 'comments', 'users', 'all'
 * - communityId: optional, valid UUID to filter by community
 * - limit: optional, number between 1 and 100
 * - offset: optional, non-negative number
 */
export const SearchQuerySchema = z.object({
  q: z.string().min(1, "Search query must be at least 1 character"),
  type: z
    .enum(["posts", "comments", "users", "all"])
    .optional()
    .default("all"),
  communityId: z.string().uuid("Community ID must be a valid UUID").optional(),
  limit: z
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit must not exceed 100")
    .optional()
    .default(20),
  offset: z
    .number()
    .int()
    .min(0, "Offset must be non-negative")
    .optional()
    .default(0),
});

// Type exports for use in API routes
export type SearchQueryInput = z.infer<typeof SearchQuerySchema>;
