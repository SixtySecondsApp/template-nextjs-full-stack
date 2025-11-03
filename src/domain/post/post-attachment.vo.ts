/**
 * PostAttachment value object represents a file attachment on a post.
 * Immutable value object - cannot be modified after creation.
 *
 * Business Rules:
 * - File size: Maximum 10MB (10,485,760 bytes)
 * - MIME types: Restricted to safe types (images, PDFs, documents)
 * - URL must be valid HTTPS URL
 * - File name is required and non-empty
 */
export class PostAttachment {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  private static readonly ALLOWED_MIME_TYPES = [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    // Text
    "text/plain",
    "text/markdown",
    "text/csv",
  ];

  private constructor(
    private readonly id: string,
    private readonly postId: string,
    private readonly fileName: string,
    private readonly fileUrl: string,
    private readonly fileSize: number,
    private readonly mimeType: string,
    private readonly createdAt: Date
  ) {
    this.validateFileName(fileName);
    this.validateFileUrl(fileUrl);
    this.validateFileSize(fileSize);
    this.validateMimeType(mimeType);
  }

  /**
   * Factory method to create a new PostAttachment value object.
   * @throws Error if any validation fails
   */
  static create(props: {
    id: string;
    postId: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }): PostAttachment {
    return new PostAttachment(
      props.id,
      props.postId,
      props.fileName,
      props.fileUrl,
      props.fileSize,
      props.mimeType,
      new Date()
    );
  }

  /**
   * Factory method to reconstitute a PostAttachment from persistence.
   */
  static reconstitute(props: {
    id: string;
    postId: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    createdAt: Date;
  }): PostAttachment {
    return new PostAttachment(
      props.id,
      props.postId,
      props.fileName,
      props.fileUrl,
      props.fileSize,
      props.mimeType,
      props.createdAt
    );
  }

  // Getters

  getId(): string {
    return this.id;
  }

  getPostId(): string {
    return this.postId;
  }

  getFileName(): string {
    return this.fileName;
  }

  getFileUrl(): string {
    return this.fileUrl;
  }

  getFileSize(): number {
    return this.fileSize;
  }

  getMimeType(): string {
    return this.mimeType;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  /**
   * Get file size in human-readable format (e.g., "2.5 MB").
   */
  getFileSizeFormatted(): string {
    const kb = this.fileSize / 1024;
    const mb = kb / 1024;

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    } else if (kb >= 1) {
      return `${kb.toFixed(2)} KB`;
    } else {
      return `${this.fileSize} bytes`;
    }
  }

  /**
   * Check if the attachment is an image.
   */
  isImage(): boolean {
    return this.mimeType.startsWith("image/");
  }

  /**
   * Check if the attachment is a PDF.
   */
  isPdf(): boolean {
    return this.mimeType === "application/pdf";
  }

  /**
   * Check if the attachment is a document (Word, Excel, PowerPoint).
   */
  isDocument(): boolean {
    return (
      this.mimeType.includes("msword") ||
      this.mimeType.includes("ms-excel") ||
      this.mimeType.includes("ms-powerpoint") ||
      this.mimeType.includes("officedocument")
    );
  }

  // Value object equality

  /**
   * Value objects are equal if all their properties are equal.
   */
  equals(other: PostAttachment): boolean {
    return (
      this.id === other.id &&
      this.postId === other.postId &&
      this.fileName === other.fileName &&
      this.fileUrl === other.fileUrl &&
      this.fileSize === other.fileSize &&
      this.mimeType === other.mimeType
    );
  }

  // Private validation methods

  private validateFileName(fileName: string): void {
    if (!fileName || fileName.trim().length === 0) {
      throw new Error("File name is required");
    }

    if (fileName.length > 255) {
      throw new Error("File name must not exceed 255 characters");
    }
  }

  private validateFileUrl(url: string): void {
    if (!url || url.trim().length === 0) {
      throw new Error("File URL is required");
    }

    try {
      const parsedUrl = new URL(url);

      // Ensure it's HTTPS for security
      if (parsedUrl.protocol !== "https:") {
        throw new Error("File URL must use HTTPS protocol");
      }
    } catch {
      throw new Error("Invalid file URL format");
    }
  }

  private validateFileSize(size: number): void {
    if (size <= 0) {
      throw new Error("File size must be greater than 0");
    }

    if (size > PostAttachment.MAX_FILE_SIZE) {
      throw new Error(
        `File size must not exceed ${PostAttachment.MAX_FILE_SIZE / 1024 / 1024}MB`
      );
    }
  }

  private validateMimeType(mimeType: string): void {
    if (!mimeType || mimeType.trim().length === 0) {
      throw new Error("MIME type is required");
    }

    if (!PostAttachment.ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
      throw new Error(
        `MIME type '${mimeType}' is not allowed. Allowed types: ${PostAttachment.ALLOWED_MIME_TYPES.join(", ")}`
      );
    }
  }

  /**
   * Get all allowed MIME types.
   */
  static getAllowedMimeTypes(): string[] {
    return [...PostAttachment.ALLOWED_MIME_TYPES];
  }

  /**
   * Get maximum file size in bytes.
   */
  static getMaxFileSize(): number {
    return PostAttachment.MAX_FILE_SIZE;
  }
}
