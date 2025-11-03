/**
 * Shared types for version history components
 */

export interface ContentVersion {
  id: string;
  versionNumber: number;
  content: string; // HTML content
  createdAt: Date;
  isCurrent?: boolean;
  authorName?: string;
}

export type ContentType = 'POST' | 'COMMENT';

export interface VersionHistoryResponse {
  success: boolean;
  data?: ContentVersion[];
  message?: string;
}

export interface RestoreVersionResponse {
  success: boolean;
  data?: {
    id: string;
    content: string;
    versionNumber: number;
  };
  message?: string;
}
