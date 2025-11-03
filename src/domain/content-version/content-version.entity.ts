import {
  CreateContentVersionInput,
  ReconstituteContentVersionInput,
} from "./content-version.types";

/**
 * ContentType enum representing the type of content being versioned.
 * Maps to Prisma ContentType enum.
 */
export enum ContentType {
  POST = "POST",
  COMMENT = "COMMENT",
}

/**
 * ContentVersion entity represents an immutable snapshot of post or comment content.
 * Follows hexagonal architecture with pure domain logic - NO framework dependencies.
 *
 * Business Rules:
 * - Content snapshots are immutable once created
 * - Version numbers start at 1 and increment sequentially
 * - Content cannot be empty
 * - Versions serve as audit trail and enable version history/restore
 * - Polymorphic reference: contentId references either Post.id or Comment.id based on contentType
 */
export class ContentVersion {
  private constructor(
    private readonly id: string,
    private readonly contentType: ContentType,
    private readonly contentId: string,
    private readonly content: string, // Snapshot of HTML content
    private readonly versionNumber: number,
    private readonly createdAt: Date
  ) {
    this.validateContent(content);
    this.validateVersionNumber(versionNumber);
    this.validateContentType(contentType);
  }

  /**
   * Factory method to create a new ContentVersion entity.
   * Used when creating a new version snapshot.
   *
   * @param input - Content version creation parameters
   * @returns New ContentVersion instance
   * @throws Error if validation fails
   */
  public static create(input: CreateContentVersionInput): ContentVersion {
    return new ContentVersion(
      input.id,
      input.contentType,
      input.contentId,
      input.content,
      input.versionNumber,
      new Date()
    );
  }

  /**
   * Factory method to reconstitute a ContentVersion entity from persistence.
   * Used when loading existing versions from database.
   *
   * @param input - Complete content version data from persistence
   * @returns Reconstituted ContentVersion instance
   * @throws Error if validation fails
   */
  public static reconstitute(
    input: ReconstituteContentVersionInput
  ): ContentVersion {
    return new ContentVersion(
      input.id,
      input.contentType,
      input.contentId,
      input.content,
      input.versionNumber,
      input.createdAt
    );
  }

  // Getters (immutable entity - no setters)

  public getId(): string {
    return this.id;
  }

  public getContentType(): ContentType {
    return this.contentType;
  }

  public getContentId(): string {
    return this.contentId;
  }

  public getContent(): string {
    return this.content;
  }

  public getVersionNumber(): number {
    return this.versionNumber;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  /**
   * Check if this version is for a post.
   */
  public isPostVersion(): boolean {
    return this.contentType === ContentType.POST;
  }

  /**
   * Check if this version is for a comment.
   */
  public isCommentVersion(): boolean {
    return this.contentType === ContentType.COMMENT;
  }

  // Private validation methods

  private validateContent(content: string): void {
    if (!content || content.trim().length === 0) {
      throw new Error("Content snapshot is required and cannot be empty");
    }
  }

  private validateVersionNumber(versionNumber: number): void {
    if (!Number.isInteger(versionNumber)) {
      throw new Error("Version number must be an integer");
    }

    if (versionNumber < 1) {
      throw new Error("Version number must be at least 1");
    }
  }

  private validateContentType(contentType: ContentType): void {
    const validTypes = Object.values(ContentType);
    if (!validTypes.includes(contentType)) {
      throw new Error(
        `Invalid content type. Must be one of: ${validTypes.join(", ")}`
      );
    }
  }
}
