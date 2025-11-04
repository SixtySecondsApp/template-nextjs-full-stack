/**
 * Like Entity
 *
 * Represents a user's like on either a post or a comment.
 * This is a pure domain entity with encapsulated business logic.
 *
 * Business Rules:
 * - A like must be associated with either a post OR a comment (not both, not neither)
 * - A user can only like a specific post or comment once (enforced at repository level)
 * - Likes are immutable once created
 */
export class Like {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly postId: string | null,
    private readonly commentId: string | null,
    private readonly createdAt: Date
  ) {
    this.validateLikeTarget();
  }

  /**
   * Factory method to create a Like for a post
   *
   * @param props - Like creation properties for a post
   * @returns A new Like instance for a post
   */
  static createForPost(props: {
    id: string;
    userId: string;
    postId: string;
  }): Like {
    if (!props.postId || props.postId.trim().length === 0) {
      throw new Error("Post ID is required when liking a post");
    }

    return new Like(props.id, props.userId, props.postId, null, new Date());
  }

  /**
   * Factory method to create a Like for a comment
   *
   * @param props - Like creation properties for a comment
   * @returns A new Like instance for a comment
   */
  static createForComment(props: {
    id: string;
    userId: string;
    commentId: string;
  }): Like {
    if (!props.commentId || props.commentId.trim().length === 0) {
      throw new Error("Comment ID is required when liking a comment");
    }

    return new Like(
      props.id,
      props.userId,
      null,
      props.commentId,
      new Date()
    );
  }

  /**
   * Factory method to reconstitute a Like from persistence
   *
   * @param props - Complete Like properties from database
   * @returns A reconstituted Like instance
   * @throws Error if validation fails
   */
  static reconstitute(props: {
    id: string;
    userId: string;
    postId: string | null;
    commentId: string | null;
    createdAt: Date;
  }): Like {
    return new Like(
      props.id,
      props.userId,
      props.postId,
      props.commentId,
      props.createdAt
    );
  }

  /**
   * Validates that the like has exactly one target (post OR comment)
   *
   * @throws Error if validation fails
   */
  private validateLikeTarget(): void {
    const hasPost = this.postId !== null;
    const hasComment = this.commentId !== null;

    if (!hasPost && !hasComment) {
      throw new Error("Like must be associated with either a post or a comment");
    }

    if (hasPost && hasComment) {
      throw new Error(
        "Like cannot be associated with both a post and a comment"
      );
    }
  }

  // Getters for accessing private fields

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getPostId(): string | null {
    return this.postId;
  }

  getCommentId(): string | null {
    return this.commentId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  /**
   * Checks if this like is for a post
   *
   * @returns true if the like is for a post
   */
  isPostLike(): boolean {
    return this.postId !== null;
  }

  /**
   * Checks if this like is for a comment
   *
   * @returns true if the like is for a comment
   */
  isCommentLike(): boolean {
    return this.commentId !== null;
  }

  /**
   * Gets the target ID (either post or comment)
   *
   * @returns the ID of the liked entity
   */
  getTargetId(): string {
    return (this.postId ?? this.commentId) as string;
  }

  /**
   * Gets the target type
   *
   * @returns 'post' or 'comment'
   */
  getTargetType(): "post" | "comment" {
    return this.postId !== null ? "post" : "comment";
  }
}

export default Like;
