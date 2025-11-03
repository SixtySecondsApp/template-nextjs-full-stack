import {
  CreateCommentInput,
  ReconstituteCommentInput,
} from "./comment.types";

/**
 * Comment entity represents a comment on a forum post.
 * Follows hexagonal architecture with pure domain logic - NO framework dependencies.
 *
 * Business Rules:
 * - Content: Minimum 1 character (rich text HTML)
 * - Supports threading with parentId (max 2 levels in V1)
 * - Cannot modify archived comments
 * - Cannot nest comments beyond 2 levels deep
 * - Counters (likes, helpful) increment only, never decrement via domain logic
 */
export class Comment {
  private constructor(
    private readonly id: string,
    private readonly postId: string,
    private readonly authorId: string,
    private readonly parentId: string | null,
    private content: string, // Rich text HTML
    private likeCount: number,
    private helpfulCount: number,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private deletedAt: Date | null = null
  ) {
    this.validateContent(content);
  }

  /**
   * Factory method to create a new Comment entity.
   * @throws Error if nesting level exceeds maximum depth (handled in use case)
   */
  static create(input: CreateCommentInput): Comment {
    return new Comment(
      input.id,
      input.postId,
      input.authorId,
      input.parentId ?? null,
      input.content,
      0, // likeCount
      0, // helpfulCount
      new Date(),
      new Date(),
      null // deletedAt
    );
  }

  /**
   * Factory method to reconstitute a Comment entity from persistence.
   */
  static reconstitute(input: ReconstituteCommentInput): Comment {
    return new Comment(
      input.id,
      input.postId,
      input.authorId,
      input.parentId,
      input.content,
      input.likeCount,
      input.helpfulCount,
      input.createdAt,
      input.updatedAt,
      input.deletedAt
    );
  }

  // Getters

  getId(): string {
    return this.id;
  }

  getPostId(): string {
    return this.postId;
  }

  getAuthorId(): string {
    return this.authorId;
  }

  getParentId(): string | null {
    return this.parentId;
  }

  getContent(): string {
    return this.content;
  }

  getLikeCount(): number {
    return this.likeCount;
  }

  getHelpfulCount(): number {
    return this.helpfulCount;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getDeletedAt(): Date | null {
    return this.deletedAt;
  }

  isArchived(): boolean {
    return this.deletedAt !== null;
  }

  isReply(): boolean {
    return this.parentId !== null;
  }

  isTopLevel(): boolean {
    return this.parentId === null;
  }

  // Business logic methods

  /**
   * Update comment content.
   * @throws Error if comment is archived or validation fails
   */
  update(content: string): void {
    this.ensureNotArchived();
    this.validateContent(content);

    this.content = content;
    this.updatedAt = new Date();
  }

  /**
   * Archive (soft delete) the comment.
   * @throws Error if comment is already archived
   */
  archive(): void {
    if (this.isArchived()) {
      throw new Error("Comment is already archived");
    }

    this.deletedAt = new Date();
  }

  /**
   * Restore comment from archived state.
   * @throws Error if comment is not archived
   */
  restore(): void {
    if (!this.isArchived()) {
      throw new Error("Comment is not archived");
    }

    this.deletedAt = null;
    this.updatedAt = new Date();
  }

  /**
   * Increment the like counter when a user likes the comment.
   */
  incrementLikeCount(): void {
    this.likeCount += 1;
    this.updatedAt = new Date();
  }

  /**
   * Increment the helpful counter when a user marks the comment as helpful.
   */
  incrementHelpfulCount(): void {
    this.helpfulCount += 1;
    this.updatedAt = new Date();
  }

  // Private validation methods

  private validateContent(content: string): void {
    if (!content || content.trim().length === 0) {
      throw new Error("Comment content is required");
    }

    // Strip HTML tags for length validation
    const textContent = content.replace(/<[^>]*>/g, "").trim();

    if (textContent.length < 1) {
      throw new Error("Comment content must be at least 1 character");
    }
  }

  private ensureNotArchived(): void {
    if (this.isArchived()) {
      throw new Error("Cannot modify archived comment");
    }
  }
}
