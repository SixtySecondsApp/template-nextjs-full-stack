import { z } from "zod";

/**
 * Validation Schema: Mention Search
 * Used for @mention autocomplete functionality
 */
export const MentionSearchSchema = z.object({
  q: z
    .string()
    .min(1, "Query must be at least 1 character")
    .max(50, "Query too long"),
  communityId: z.string().uuid("Invalid community ID"),
});

/**
 * Type exports for TypeScript
 */
export type MentionSearchInput = z.infer<typeof MentionSearchSchema>;
