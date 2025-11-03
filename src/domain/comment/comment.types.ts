/**
 * Input types for Comment domain entity.
 * Used by factory methods to create/reconstitute Comment instances.
 */

/**
 * Input for creating a new Comment entity.
 * Only includes required fields for comment creation.
 */
export interface CreateCommentInput {
  id: string;
  postId: string;
  authorId: string;
  parentId?: string | null;
  content: string;
}

/**
 * Input for reconstituting a Comment entity from persistence.
 * Includes all fields including timestamps and state.
 */
export interface ReconstituteCommentInput {
  id: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  content: string;
  mentionedUserIds?: string[];
  likeCount: number;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
