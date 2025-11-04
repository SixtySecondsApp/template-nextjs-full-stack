/**
 * Fake Post Repository for Testing
 *
 * In-memory implementation of IPostRepository for testing Application layer
 * Use Cases without requiring a real database.
 */

// Type definitions (adjust based on actual implementation)
interface Post {
  id: string;
  communityId: string;
  authorId: string;
  title: string;
  body: string;
  isDraft: boolean;
  category: string | null;
  isPinned: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  deletedAt: Date | null;
}

interface IPostRepository {
  create(post: Post): Promise<Post>;
  findById(id: string): Promise<Post | null>;
  findByIdIncludingDeleted(id: string): Promise<Post | null>;
  findAll(filters?: {
    communityId?: string;
    authorId?: string;
    isDraft?: boolean;
    isPinned?: boolean;
  }): Promise<Post[]>;
  update(post: Post): Promise<Post>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<void>;
  hardDelete(id: string): Promise<void>;
}

/**
 * Fake Post Repository - In-Memory Implementation
 *
 * Benefits:
 * - Fast test execution (no database I/O)
 * - Predictable behavior
 * - Easy to reset between tests
 * - No external dependencies
 */
export class FakePostRepository implements IPostRepository {
  private posts: Post[] = [];

  /**
   * Create a new post
   */
  async create(post: Post): Promise<Post> {
    this.posts.push({ ...post });
    return post;
  }

  /**
   * Find post by ID (excludes soft-deleted)
   */
  async findById(id: string): Promise<Post | null> {
    const post = this.posts.find((p) => p.id === id && p.deletedAt === null);
    return post ? { ...post } : null;
  }

  /**
   * Find post by ID including soft-deleted posts
   */
  async findByIdIncludingDeleted(id: string): Promise<Post | null> {
    const post = this.posts.find((p) => p.id === id);
    return post ? { ...post } : null;
  }

  /**
   * Find all posts with optional filters (excludes soft-deleted)
   */
  async findAll(filters?: {
    communityId?: string;
    authorId?: string;
    isDraft?: boolean;
    isPinned?: boolean;
  }): Promise<Post[]> {
    let results = this.posts.filter((p) => p.deletedAt === null);

    if (filters?.communityId) {
      results = results.filter((p) => p.communityId === filters.communityId);
    }

    if (filters?.authorId) {
      results = results.filter((p) => p.authorId === filters.authorId);
    }

    if (filters?.isDraft !== undefined) {
      results = results.filter((p) => p.isDraft === filters.isDraft);
    }

    if (filters?.isPinned !== undefined) {
      results = results.filter((p) => p.isPinned === filters.isPinned);
    }

    // Return copies to prevent mutation
    return results.map((p) => ({ ...p }));
  }

  /**
   * Update existing post
   */
  async update(post: Post): Promise<Post> {
    const index = this.posts.findIndex((p) => p.id === post.id);
    if (index === -1) {
      throw new Error(`Post with id ${post.id} not found`);
    }

    this.posts[index] = { ...post, updatedAt: new Date() };
    return this.posts[index];
  }

  /**
   * Soft delete post (set deletedAt timestamp)
   */
  async softDelete(id: string): Promise<void> {
    const post = this.posts.find((p) => p.id === id);
    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }

    post.deletedAt = new Date();
    post.updatedAt = new Date();
  }

  /**
   * Restore soft-deleted post (clear deletedAt)
   */
  async restore(id: string): Promise<void> {
    const post = this.posts.find((p) => p.id === id);
    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }

    post.deletedAt = null;
    post.updatedAt = new Date();
  }

  /**
   * Permanently delete post (hard delete)
   */
  async hardDelete(id: string): Promise<void> {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Post with id ${id} not found`);
    }

    this.posts.splice(index, 1);
  }

  // ========== Test Helper Methods ==========
  // These methods are only for testing convenience

  /**
   * Reset repository to empty state
   */
  reset(): void {
    this.posts = [];
  }

  /**
   * Get all posts including soft-deleted (for testing)
   */
  getAllIncludingDeleted(): Post[] {
    return this.posts.map((p) => ({ ...p }));
  }

  /**
   * Get count of posts (excluding soft-deleted)
   */
  getCount(): number {
    return this.posts.filter((p) => p.deletedAt === null).length;
  }

  /**
   * Get count of all posts including soft-deleted
   */
  getTotalCount(): number {
    return this.posts.length;
  }

  /**
   * Manually add post (bypass create logic for test setup)
   */
  addPost(post: Post): void {
    this.posts.push({ ...post });
  }
}
