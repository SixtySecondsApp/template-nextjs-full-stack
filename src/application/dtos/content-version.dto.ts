/**
 * Content Version DTOs
 * Data Transfer Objects for content versioning system
 */

export interface ContentVersionDto {
  id: string;
  contentType: 'POST' | 'COMMENT';
  contentId: string;
  content: string; // HTML snapshot
  versionNumber: number;
  createdAt: Date;
}

export interface CreateContentVersionDto {
  contentType: 'POST' | 'COMMENT';
  contentId: string;
  content: string;
  versionNumber: number;
}

export interface RestoreVersionDto {
  contentId: string;
  versionNumber: number;
}
