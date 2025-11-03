import { z } from 'zod';

/**
 * Zod validation schemas for Version API endpoints.
 * These schemas validate request bodies before passing to use cases.
 */

/**
 * Schema for getting version history for content.
 * Validates:
 * - contentId: required, valid UUID
 */
export const GetVersionHistorySchema = z.object({
  contentId: z.string().uuid('Content ID must be a valid UUID')
});

/**
 * Schema for getting a specific version.
 * Validates:
 * - contentId: required, valid UUID
 * - versionNumber: required, positive integer
 */
export const GetVersionSchema = z.object({
  contentId: z.string().uuid('Content ID must be a valid UUID'),
  versionNumber: z.number().int('Version number must be an integer').min(1, 'Version number must be at least 1')
});

/**
 * Schema for restoring content to a specific version.
 * Validates:
 * - contentId: required, valid UUID
 * - versionNumber: required, positive integer
 */
export const RestoreVersionSchema = z.object({
  contentId: z.string().uuid('Content ID must be a valid UUID'),
  versionNumber: z.number().int('Version number must be an integer').min(1, 'Version number must be at least 1')
});

/**
 * Schema for comparing two versions.
 * Validates:
 * - contentId: required, valid UUID
 * - oldVersionNumber: required, positive integer
 * - newVersionNumber: required, positive integer
 * - oldVersionNumber and newVersionNumber must be different
 */
export const CompareVersionsSchema = z.object({
  contentId: z.string().uuid('Content ID must be a valid UUID'),
  oldVersionNumber: z.number().int('Old version number must be an integer').min(1, 'Old version number must be at least 1'),
  newVersionNumber: z.number().int('New version number must be an integer').min(1, 'New version number must be at least 1')
}).refine(
  (data) => data.oldVersionNumber !== data.newVersionNumber,
  { message: 'Old and new version numbers must be different' }
);

// Type exports for use in API routes
export type GetVersionHistoryInput = z.infer<typeof GetVersionHistorySchema>;
export type GetVersionInput = z.infer<typeof GetVersionSchema>;
export type RestoreVersionInput = z.infer<typeof RestoreVersionSchema>;
export type CompareVersionsInput = z.infer<typeof CompareVersionsSchema>;
