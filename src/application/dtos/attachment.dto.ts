/**
 * Attachment Data Transfer Objects
 * Plain TypeScript interfaces for file attachments
 * NO domain logic, NO Prisma types
 */

/**
 * Attachment DTO for API responses
 * Represents a file attached to a post
 */
export interface AttachmentDto {
  id: string;
  postId: string | null;
  url: string; // Cloud storage URL
  fileName: string;
  fileType: string; // MIME type
  fileSize: number; // Bytes
  uploadedBy: string; // User ID
  createdAt: string; // ISO 8601 string
}

/**
 * Upload Attachment DTO for API requests
 * Metadata for file upload
 */
export interface UploadAttachmentDto {
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
}

/**
 * Link Attachments DTO for API requests
 * Associate attachments with a post
 */
export interface LinkAttachmentsDto {
  postId: string;
  attachmentIds: string[];
}
