import { z } from "zod";

/**
 * Zod validation schemas for Community API endpoints.
 * These schemas validate request bodies before passing to use cases.
 */

/**
 * Schema for creating a new community.
 * Validates:
 * - name: required, 3-100 chars, alphanumeric with spaces/hyphens/underscores
 * - logoUrl: optional, valid HTTP/HTTPS URL
 * - primaryColor: optional, valid hex color code (e.g., #0066CC or #06C)
 * - ownerId: required, non-empty string
 */
export const CreateCommunitySchema = z.object({
  name: z
    .string()
    .min(3, "Community name must be at least 3 characters")
    .max(100, "Community name must not exceed 100 characters")
    .regex(
      /^[a-zA-Z0-9\s_-]+$/,
      "Community name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
  logoUrl: z
    .string()
    .url("Invalid logo URL format")
    .refine(
      (url) => {
        try {
          const parsed = new URL(url);
          return ["http:", "https:"].includes(parsed.protocol);
        } catch {
          return false;
        }
      },
      { message: "Logo URL must use HTTP or HTTPS protocol" }
    )
    .nullable()
    .optional(),
  primaryColor: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Primary color must be a valid hex color code (e.g., #0066CC or #06C)"
    )
    .optional(),
  ownerId: z.string().min(1, "Owner ID is required"),
});

/**
 * Schema for updating community branding.
 * All fields are optional to support partial updates.
 * Validates:
 * - name: optional, 3-100 chars, alphanumeric with spaces/hyphens/underscores
 * - logoUrl: optional, valid HTTP/HTTPS URL
 * - primaryColor: optional, valid hex color code
 */
export const UpdateCommunitySchema = z.object({
  name: z
    .string()
    .min(3, "Community name must be at least 3 characters")
    .max(100, "Community name must not exceed 100 characters")
    .regex(
      /^[a-zA-Z0-9\s_-]+$/,
      "Community name can only contain letters, numbers, spaces, hyphens, and underscores"
    )
    .optional(),
  logoUrl: z
    .string()
    .url("Invalid logo URL format")
    .refine(
      (url) => {
        try {
          const parsed = new URL(url);
          return ["http:", "https:"].includes(parsed.protocol);
        } catch {
          return false;
        }
      },
      { message: "Logo URL must use HTTP or HTTPS protocol" }
    )
    .nullable()
    .optional(),
  primaryColor: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Primary color must be a valid hex color code (e.g., #0066CC or #06C)"
    )
    .optional(),
});

/**
 * Schema for transferring community ownership.
 * Validates:
 * - ownerId: required, non-empty string
 */
export const TransferOwnershipSchema = z.object({
  ownerId: z.string().min(1, "New owner ID is required"),
});

// Type exports for use in API routes
export type CreateCommunityInput = z.infer<typeof CreateCommunitySchema>;
export type UpdateCommunityInput = z.infer<typeof UpdateCommunitySchema>;
export type TransferOwnershipInput = z.infer<typeof TransferOwnershipSchema>;
