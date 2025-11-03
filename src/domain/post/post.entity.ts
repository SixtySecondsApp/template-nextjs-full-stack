import {
  CreatePostInput,
  ReconstitutePostInput,
  UpdatePostInput,
} from "./post.types";
import {
  ContentVersion,
  ContentType,
} from "../content-version/content-version.entity";

/**
 * Post entity represents a forum post within a community.
 * Follows hexagonal architecture with pure domain logic - NO framework dependencies.
 *
 * Business Rules:
 * - Title: 3-200 characters
 * - Content: Minimum 10 characters (rich text HTML)
 * - Posts start as drafts (publishedAt = null)
 * - Cannot modify archived posts
 * - Cannot publish empty content
 * - Cannot mark non-published posts as solved
 * - Pin/unpin only for published posts
 * - Counters (likes, helpful, comments, views) increment only, never decrement via domain logic
 */
export class Post {
  private constructor(
    private readonly id: string,
    private readonly communityId: string,
    private readonly authorId: string,
    private title: string,
    private content: string, // Rich text HTML
    private mentionedUserIds: string[], // User IDs mentioned in content
    private isPinned: boolean,
    private isSolved: boolean,
    private likeCount: number,
    private helpfulCount: number,
    private commentCount: number,
    private viewCount: number,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private publishedAt: Date | null,
    private deletedAt: Date | null = null
  ) {
    this.validateTitle(title);
    this.validateContent(content);
  }

  /**
   * Factory method to create a new Post entity.
   * Post starts as a draft (publishedAt = null).
   */
  static create(input: CreatePostInput): Post {
    const post = new Post(
      input.id,
      input.communityId,
      input.authorId,
      input.title,
      input.content,
      [], // mentionedUserIds (will be extracted from content)
      false, // isPinned
      false, // isSolved
      0, // likeCount
      0, // helpfulCount
      0, // commentCount
      0, // viewCount
      new Date(),
      new Date(),
      null, // publishedAt (draft)
      null // deletedAt
    );

    // Extract mentions from content on creation
    post.mentionedUserIds = post.extractMentions(input.content);

    return post;
  }

  /**
   * Factory method to reconstitute a Post entity from persistence.
   */
  static reconstitute(input: ReconstitutePostInput): Post {
    return new Post(
      input.id,
      input.communityId,
      input.authorId,
      input.title,
      input.content,
      input.mentionedUserIds ?? [],
      input.isPinned,
      input.isSolved,
      input.likeCount,
      input.helpfulCount,
      input.commentCount,
      input.viewCount,
      input.createdAt,
      input.updatedAt,
      input.publishedAt,
      input.deletedAt
    );
  }

  // Getters

  getId(): string {
    return this.id;
  }

  getCommunityId(): string {
    return this.communityId;
  }

  getAuthorId(): string {
    return this.authorId;
  }

  getTitle(): string {
    return this.title;
  }

  getContent(): string {
    return this.content;
  }

  getIsPinned(): boolean {
    return this.isPinned;
  }

  getIsSolved(): boolean {
    return this.isSolved;
  }

  getLikeCount(): number {
    return this.likeCount;
  }

  getHelpfulCount(): number {
    return this.helpfulCount;
  }

  getCommentCount(): number {
    return this.commentCount;
  }

  getViewCount(): number {
    return this.viewCount;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getPublishedAt(): Date | null {
    return this.publishedAt;
  }

  getDeletedAt(): Date | null {
    return this.deletedAt;
  }

  getMentionedUserIds(): string[] {
    return [...this.mentionedUserIds];
  }

  isArchived(): boolean {
    return this.deletedAt !== null;
  }

  isDraft(): boolean {
    return this.publishedAt === null;
  }

  isPublished(): boolean {
    return this.publishedAt !== null;
  }

  // Business logic methods

  /**
   * Update post content (title and/or content).
   * Re-extracts mentions if content is updated.
   * @throws Error if post is archived or validation fails
   */
  update(input: UpdatePostInput): void {
    this.ensureNotArchived();

    if (input.title !== undefined) {
      this.validateTitle(input.title);
      this.title = input.title;
    }

    if (input.content !== undefined) {
      this.validateContent(input.content);
      this.content = input.content;
      // Re-extract mentions from updated content
      this.mentionedUserIds = this.extractMentions(input.content);
    }

    this.updatedAt = new Date();
  }

  /**
   * Publish the post, making it visible to community members.
   * @throws Error if post is archived, already published, or has invalid content
   */
  publish(): void {
    this.ensureNotArchived();

    if (this.isPublished()) {
      throw new Error("Post is already published");
    }

    // Ensure content is valid before publishing
    this.validateTitle(this.title);
    this.validateContent(this.content);

    this.publishedAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Archive (soft delete) the post.
   * @throws Error if post is already archived
   */
  archive(): void {
    if (this.isArchived()) {
      throw new Error("Post is already archived");
    }

    this.deletedAt = new Date();
  }

  /**
   * Restore post from archived state.
   * @throws Error if post is not archived
   */
  restore(): void {
    if (!this.isArchived()) {
      throw new Error("Post is not archived");
    }

    this.deletedAt = null;
    this.updatedAt = new Date();
  }

  /**
   * Pin the post to the top of the community feed.
   * @throws Error if post is archived or not published
   */
  pin(): void {
    this.ensureNotArchived();
    this.ensurePublished();

    if (this.isPinned) {
      throw new Error("Post is already pinned");
    }

    this.isPinned = true;
    this.updatedAt = new Date();
  }

  /**
   * Unpin the post from the top of the community feed.
   * @throws Error if post is archived or not pinned
   */
  unpin(): void {
    this.ensureNotArchived();

    if (!this.isPinned) {
      throw new Error("Post is not pinned");
    }

    this.isPinned = false;
    this.updatedAt = new Date();
  }

  /**
   * Mark the post as solved (e.g., question has been answered).
   * @throws Error if post is archived or not published
   */
  markSolved(): void {
    this.ensureNotArchived();
    this.ensurePublished();

    if (this.isSolved) {
      throw new Error("Post is already marked as solved");
    }

    this.isSolved = true;
    this.updatedAt = new Date();
  }

  /**
   * Mark the post as unsolved.
   * @throws Error if post is archived or not solved
   */
  markUnsolved(): void {
    this.ensureNotArchived();

    if (!this.isSolved) {
      throw new Error("Post is not marked as solved");
    }

    this.isSolved = false;
    this.updatedAt = new Date();
  }

  /**
   * Increment the like counter when a user likes the post.
   */
  incrementLikeCount(): void {
    this.likeCount += 1;
    this.updatedAt = new Date();
  }

  /**
   * Increment the helpful counter when a user marks the post as helpful.
   */
  incrementHelpfulCount(): void {
    this.helpfulCount += 1;
    this.updatedAt = new Date();
  }

  /**
   * Increment the comment counter when a new comment is added.
   */
  incrementCommentCount(): void {
    this.commentCount += 1;
    this.updatedAt = new Date();
  }

  /**
   * Decrement the comment counter when a comment is deleted.
   */
  decrementCommentCount(): void {
    if (this.commentCount > 0) {
      this.commentCount -= 1;
      this.updatedAt = new Date();
    }
  }

  /**
   * Increment the view counter when a user views the post.
   */
  incrementViewCount(): void {
    this.viewCount += 1;
    this.updatedAt = new Date();
  }

  /**
   * Create a version snapshot of the current post content.
   * Used for version history tracking and restore functionality.
   *
   * @param versionNumber - The version number for this snapshot (sequential)
   * @returns ContentVersion entity representing this snapshot
   */
  createVersionSnapshot(versionNumber: number): ContentVersion {
    return ContentVersion.create({
      id: crypto.randomUUID(),
      contentType: ContentType.POST,
      contentId: this.id,
      content: this.content,
      versionNumber,
    });
  }

  /**
   * Add a mentioned user ID to the post.
   * @param userId - The ID of the user to mention
   * @throws Error if userId is empty or already mentioned
   */
  addMention(userId: string): void {
    if (!userId || userId.trim().length === 0) {
      throw new Error("User ID cannot be empty");
    }

    if (this.mentionedUserIds.includes(userId)) {
      throw new Error("User is already mentioned");
    }

    this.mentionedUserIds.push(userId);
    this.updatedAt = new Date();
  }

  /**
   * Extract user mentions from content.
   * Looks for @[userId:userName] pattern in HTML content.
   * @param content - The HTML content to parse
   * @returns Array of unique user IDs mentioned in the content
   */
  extractMentions(content: string): string[] {
    if (!content) {
      return [];
    }

    // Pattern: @[userId:userName] or data-mention-id="userId"
    const mentionPattern = /@\[([^:]+):[^\]]+\]/g;
    const dataAttributePattern = /data-mention-id="([^"]+)"/g;

    const userIds = new Set<string>();

    // Extract from @[userId:userName] format
    let match;
    while ((match = mentionPattern.exec(content)) !== null) {
      userIds.add(match[1]);
    }

    // Extract from data-mention-id attribute
    while ((match = dataAttributePattern.exec(content)) !== null) {
      userIds.add(match[1]);
    }

    return Array.from(userIds);
  }

  /**
   * Check if the post contains any user mentions.
   * @returns true if the post has mentions, false otherwise
   */
  hasMentions(): boolean {
    return this.mentionedUserIds.length > 0;
  }

  // Private validation methods

  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error("Post title is required");
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle.length < 3) {
      throw new Error("Post title must be at least 3 characters");
    }

    if (trimmedTitle.length > 200) {
      throw new Error("Post title must not exceed 200 characters");
    }
  }

  private validateContent(content: string): void {
    if (!content || content.trim().length === 0) {
      throw new Error("Post content is required");
    }

    // Strip HTML tags for length validation
    const textContent = content.replace(/<[^>]*>/g, "").trim();

    if (textContent.length < 10) {
      throw new Error("Post content must be at least 10 characters");
    }
  }

  private ensureNotArchived(): void {
    if (this.isArchived()) {
      throw new Error("Cannot modify archived post");
    }
  }

  private ensurePublished(): void {
    if (this.isDraft()) {
      throw new Error("Cannot perform this action on unpublished post");
    }
  }
}
