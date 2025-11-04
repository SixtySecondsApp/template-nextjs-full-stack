/**
 * PostDraft Entity
 *
 * Represents an autosaved draft of a post in the system.
 * Drafts expire after 7 days and are automatically cleaned up.
 * This is a pure domain entity with encapsulated business logic.
 *
 * Business Rules:
 * - Drafts expire 7 days from savedAt
 * - Content must be valid JSON object
 * - Associated with a user and optionally a post
 */
export class PostDraft {
  private constructor(
    private readonly id: string,
    private readonly postId: string | null,
    private readonly userId: string,
    private content: Record<string, unknown>,
    private readonly savedAt: Date,
    private readonly expiresAt: Date
  ) {
    this.validateContent(content);
  }

  /**
   * Factory method to create a new PostDraft
   * Automatically sets expiresAt to 7 days from creation
   *
   * @param props - PostDraft creation properties
   * @returns A new PostDraft instance
   * @throws Error if validation fails
   */
  static create(props: {
    id: string;
    postId?: string | null;
    userId: string;
    content: Record<string, unknown>;
  }): PostDraft {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    return new PostDraft(
      props.id,
      props.postId ?? null,
      props.userId,
      props.content,
      now,
      expiresAt
    );
  }

  /**
   * Factory method to reconstitute a PostDraft from persistence
   *
   * @param props - Complete PostDraft properties from database
   * @returns A reconstituted PostDraft instance
   */
  static reconstitute(props: {
    id: string;
    postId: string | null;
    userId: string;
    content: Record<string, unknown>;
    savedAt: Date;
    expiresAt: Date;
  }): PostDraft {
    return new PostDraft(
      props.id,
      props.postId,
      props.userId,
      props.content,
      props.savedAt,
      props.expiresAt
    );
  }

  /**
   * Validates content is a valid JSON object
   *
   * @param content - Content to validate
   * @throws Error if content is invalid
   */
  private validateContent(content: Record<string, unknown>): void {
    if (!content || typeof content !== "object") {
      throw new Error("Draft content must be a valid JSON object");
    }

    if (Array.isArray(content)) {
      throw new Error("Draft content must be an object, not an array");
    }
  }

  /**
   * Updates the draft content
   *
   * @param newContent - New content to save
   * @throws Error if content is invalid
   */
  updateContent(newContent: Record<string, unknown>): void {
    this.validateContent(newContent);
    this.content = newContent;
  }

  /**
   * Checks if the draft has expired
   *
   * @returns true if the draft is past its expiration date
   */
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * Gets the number of days until expiration
   *
   * @returns number of days remaining (negative if expired)
   */
  daysUntilExpiration(): number {
    const now = new Date();
    const diffMs = this.expiresAt.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  // Getters for accessing private fields

  getId(): string {
    return this.id;
  }

  getPostId(): string | null {
    return this.postId;
  }

  getUserId(): string {
    return this.userId;
  }

  getContent(): Record<string, unknown> {
    // Return a copy to prevent external mutation
    return { ...this.content };
  }

  getSavedAt(): Date {
    return this.savedAt;
  }

  getExpiresAt(): Date {
    return this.expiresAt;
  }

  /**
   * Checks if this draft is associated with a post
   *
   * @returns true if the draft has a postId
   */
  hasPost(): boolean {
    return this.postId !== null;
  }
}

export default PostDraft;
