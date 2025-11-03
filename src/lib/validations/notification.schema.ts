import { z } from "zod";

/**
 * Validation Schema: Search Query
 * Used for global search functionality
 */
export const SearchQuerySchema = z.object({
  query: z
    .string()
    .min(2, "Query must be at least 2 characters")
    .max(200, "Query too long"),
  communityId: z.string().uuid("Invalid community ID"),
});

/**
 * Validation Schema: Mark Notification As Read
 * Used for marking a single notification as read
 */
export const MarkAsReadSchema = z.object({
  notificationId: z.string().uuid("Invalid notification ID"),
});

/**
 * Type exports for TypeScript
 */
export type SearchQueryInput = z.infer<typeof SearchQuerySchema>;
export type MarkAsReadInput = z.infer<typeof MarkAsReadSchema>;
