/**
 * Input types for Post domain entity.
 * Used by factory methods to create/reconstitute Post instances.
 */

/**
 * Input for creating a new Post entity.
 * Only includes required fields for post creation.
 */
export interface CreatePostInput {
  id: string;
  communityId: string;
  authorId: string;
  title: string;
  content: string;
}

/**
 * Input for reconstituting a Post entity from persistence.
 * Includes all fields including timestamps and state.
 */
export interface ReconstitutePostInput {
  id: string;
  communityId: string;
  authorId: string;
  title: string;
  content: string;
  isPinned: boolean;
  isSolved: boolean;
  likeCount: number;
  helpfulCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  deletedAt: Date | null;
}

/**
 * Input for updating post content.
 */
export interface UpdatePostInput {
  title?: string;
  content?: string;
}
