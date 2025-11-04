/**
 * Post Draft Data Transfer Objects
 * Plain TypeScript interfaces for draft post management
 * NO domain logic, NO Prisma types
 */

/**
 * Post Draft DTO for API responses
 * Represents an auto-saved draft with expiry
 */
export interface PostDraftDto {
  id: string;
  userId: string;
  postId: string | null; // null for new drafts, postId for editing existing
  content: string; // JSON snapshot of editor state
  expiresAt: string; // ISO 8601 string
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

/**
 * Save Draft DTO for API requests
 * Auto-saves draft with 7-day expiry
 */
export interface SaveDraftDto {
  userId: string;
  postId?: string; // Optional: null for new drafts
  content: string; // JSON snapshot
}

/**
 * List Drafts DTO for API responses
 * Returns user's active drafts
 */
export interface ListDraftsDto {
  drafts: PostDraftDto[];
  total: number;
}
