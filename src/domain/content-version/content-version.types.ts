import { ContentType } from "./content-version.entity";

/**
 * Input for creating a new ContentVersion entity.
 * Used when capturing a snapshot of post or comment content.
 */
export interface CreateContentVersionInput {
  id: string;
  contentType: ContentType;
  contentId: string; // Post.id or Comment.id
  content: string; // HTML content snapshot
  versionNumber: number;
}

/**
 * Input for reconstituting a ContentVersion entity from persistence.
 * Includes all fields including createdAt from database.
 */
export interface ReconstituteContentVersionInput {
  id: string;
  contentType: ContentType;
  contentId: string; // Post.id or Comment.id
  content: string; // HTML content snapshot
  versionNumber: number;
  createdAt: Date;
}
