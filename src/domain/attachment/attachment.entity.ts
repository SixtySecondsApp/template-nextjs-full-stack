/**
 * Attachment Entity
 *
 * Represents a file attachment associated with a post.
 * This is a pure domain entity with encapsulated business logic.
 *
 * Business Rules:
 * - Image files: max 10MB (10,485,760 bytes)
 * - Other files: max 25MB (26,214,400 bytes)
 * - Must have valid MIME type from allowed list
 * - URL must be a valid S3 URL format
 * - Filename must not be empty
 */
export class Attachment {
  // File size limits in bytes
  private static readonly MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

  // Allowed MIME types
  private static readonly ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ] as const;

  private static readonly ALLOWED_DOCUMENT_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
  ] as const;

  private static readonly ALLOWED_VIDEO_TYPES = [
    "video/mp4",
    "video/webm",
    "video/ogg",
  ] as const;

  private static readonly ALLOWED_AUDIO_TYPES = [
    "audio/mpeg",
    "audio/ogg",
    "audio/wav",
    "audio/webm",
  ] as const;

  private static readonly ALLOWED_ARCHIVE_TYPES = [
    "application/zip",
    "application/x-zip-compressed",
    "application/x-rar-compressed",
  ] as const;

  private constructor(
    private readonly id: string,
    private readonly postId: string,
    private readonly url: string,
    private readonly filename: string,
    private readonly mimeType: string,
    private readonly size: number,
    private readonly uploadedBy: string,
    private readonly createdAt: Date
  ) {
    this.validateFilename(filename);
    this.validateMimeType(mimeType);
    this.validateFileSize(size, this.isImage());
    this.validateUrl(url);
  }

  /**
   * Factory method to create a new Attachment
   *
   * @param props - Attachment creation properties
   * @returns A new Attachment instance
   * @throws Error if validation fails
   */
  static create(props: {
    id: string;
    postId: string;
    url: string;
    filename: string;
    mimeType: string;
    size: number;
    uploadedBy: string;
  }): Attachment {
    return new Attachment(
      props.id,
      props.postId,
      props.url,
      props.filename,
      props.mimeType,
      props.size,
      props.uploadedBy,
      new Date()
    );
  }

  /**
   * Factory method to reconstitute an Attachment from persistence
   *
   * @param props - Complete Attachment properties from database
   * @returns A reconstituted Attachment instance
   */
  static reconstitute(props: {
    id: string;
    postId: string;
    url: string;
    filename: string;
    mimeType: string;
    size: number;
    uploadedBy: string;
    createdAt: Date;
  }): Attachment {
    return new Attachment(
      props.id,
      props.postId,
      props.url,
      props.filename,
      props.mimeType,
      props.size,
      props.uploadedBy,
      props.createdAt
    );
  }

  /**
   * Validates filename is not empty
   *
   * @param filename - Filename to validate
   * @throws Error if filename is invalid
   */
  private validateFilename(filename: string): void {
    if (!filename || filename.trim().length === 0) {
      throw new Error("Attachment filename cannot be empty");
    }
  }

  /**
   * Validates MIME type is in allowed list
   *
   * @param mimeType - MIME type to validate
   * @throws Error if MIME type is not allowed
   */
  private validateMimeType(mimeType: string): void {
    const allowedTypes = [
      ...Attachment.ALLOWED_IMAGE_TYPES,
      ...Attachment.ALLOWED_DOCUMENT_TYPES,
      ...Attachment.ALLOWED_VIDEO_TYPES,
      ...Attachment.ALLOWED_AUDIO_TYPES,
      ...Attachment.ALLOWED_ARCHIVE_TYPES,
    ];

    if (!allowedTypes.includes(mimeType as any)) {
      throw new Error(
        `MIME type '${mimeType}' is not allowed. Allowed types: ${allowedTypes.join(", ")}`
      );
    }
  }

  /**
   * Validates file size based on file type
   *
   * @param size - File size in bytes
   * @param isImage - Whether the file is an image
   * @throws Error if file size exceeds limits
   */
  private validateFileSize(size: number, isImage: boolean): void {
    if (size <= 0) {
      throw new Error("Attachment size must be greater than 0");
    }

    const maxSize = isImage
      ? Attachment.MAX_IMAGE_SIZE
      : Attachment.MAX_FILE_SIZE;
    const maxSizeMB = maxSize / (1024 * 1024);

    if (size > maxSize) {
      throw new Error(
        `Attachment size (${this.formatBytes(size)}) exceeds maximum allowed size of ${maxSizeMB}MB for ${isImage ? "images" : "files"}`
      );
    }
  }

  /**
   * Validates URL is a valid S3 URL format
   *
   * @param url - URL to validate
   * @throws Error if URL is invalid
   */
  private validateUrl(url: string): void {
    if (!url || url.trim().length === 0) {
      throw new Error("Attachment URL cannot be empty");
    }

    // Basic URL validation (should be HTTPS)
    if (!url.startsWith("https://")) {
      throw new Error("Attachment URL must use HTTPS protocol");
    }

    // Optional: Add more specific S3 URL validation
    // Example: Check for s3.amazonaws.com or cloudfront.net patterns
    const isS3Url =
      url.includes(".s3.") ||
      url.includes("s3.amazonaws.com") ||
      url.includes(".cloudfront.net");

    if (!isS3Url) {
      throw new Error(
        "Attachment URL must be a valid S3 or CloudFront URL"
      );
    }
  }

  /**
   * Checks if the attachment is an image
   *
   * @returns true if the attachment is an image
   */
  isImage(): boolean {
    return (Attachment.ALLOWED_IMAGE_TYPES as readonly string[]).includes(
      this.mimeType
    );
  }

  /**
   * Checks if the attachment is a document
   *
   * @returns true if the attachment is a document
   */
  isDocument(): boolean {
    return (Attachment.ALLOWED_DOCUMENT_TYPES as readonly string[]).includes(
      this.mimeType
    );
  }

  /**
   * Checks if the attachment is a video
   *
   * @returns true if the attachment is a video
   */
  isVideo(): boolean {
    return (Attachment.ALLOWED_VIDEO_TYPES as readonly string[]).includes(
      this.mimeType
    );
  }

  /**
   * Checks if the attachment is audio
   *
   * @returns true if the attachment is audio
   */
  isAudio(): boolean {
    return (Attachment.ALLOWED_AUDIO_TYPES as readonly string[]).includes(
      this.mimeType
    );
  }

  /**
   * Checks if the attachment is an archive
   *
   * @returns true if the attachment is an archive
   */
  isArchive(): boolean {
    return (Attachment.ALLOWED_ARCHIVE_TYPES as readonly string[]).includes(
      this.mimeType
    );
  }

  /**
   * Gets the file type category
   *
   * @returns the category of the file
   */
  getFileType(): "image" | "document" | "video" | "audio" | "archive" {
    if (this.isImage()) return "image";
    if (this.isDocument()) return "document";
    if (this.isVideo()) return "video";
    if (this.isAudio()) return "audio";
    if (this.isArchive()) return "archive";
    return "document"; // Default fallback
  }

  /**
   * Formats bytes to human-readable format
   *
   * @param bytes - Number of bytes
   * @returns Formatted string (e.g., "2.5 MB")
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  /**
   * Gets human-readable file size
   *
   * @returns Formatted file size string
   */
  getFormattedSize(): string {
    return this.formatBytes(this.size);
  }

  /**
   * Gets file extension from filename
   *
   * @returns File extension (e.g., "jpg", "pdf")
   */
  getFileExtension(): string {
    const parts = this.filename.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
  }

  // Getters for accessing private fields

  getId(): string {
    return this.id;
  }

  getPostId(): string {
    return this.postId;
  }

  getUrl(): string {
    return this.url;
  }

  getFilename(): string {
    return this.filename;
  }

  getMimeType(): string {
    return this.mimeType;
  }

  getSize(): number {
    return this.size;
  }

  getUploadedBy(): string {
    return this.uploadedBy;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}

export default Attachment;
