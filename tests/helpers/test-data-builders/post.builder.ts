/**
 * Post Test Data Builder
 *
 * Fluent API for creating test Post entities with sensible defaults.
 * Makes tests more readable and maintainable.
 */

interface PostData {
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

/**
 * Test Data Builder for Post entities
 *
 * Usage:
 *
 * const post = new PostBuilder()
 *   .withTitle('My Post')
 *   .published()
 *   .build();
 *
 * const draftPost = new PostBuilder()
 *   .withTitle('Draft')
 *   .draft()
 *   .build();
 */
export class PostBuilder {
  private data: PostData;

  constructor() {
    // Sensible defaults
    this.data = {
      id: crypto.randomUUID(),
      communityId: 'default-community-id',
      authorId: 'default-author-id',
      title: 'Test Post Title',
      body: '<p>Test post body content</p>',
      isDraft: true,
      category: null,
      isPinned: false,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: null,
      deletedAt: null,
    };
  }

  /**
   * Set post ID
   */
  withId(id: string): this {
    this.data.id = id;
    return this;
  }

  /**
   * Set community ID
   */
  withCommunityId(communityId: string): this {
    this.data.communityId = communityId;
    return this;
  }

  /**
   * Set author ID
   */
  withAuthorId(authorId: string): this {
    this.data.authorId = authorId;
    return this;
  }

  /**
   * Set post title
   */
  withTitle(title: string): this {
    this.data.title = title;
    return this;
  }

  /**
   * Set post body content
   */
  withBody(body: string): this {
    this.data.body = body;
    return this;
  }

  /**
   * Set post category
   */
  withCategory(category: string): this {
    this.data.category = category;
    return this;
  }

  /**
   * Mark post as draft
   */
  draft(): this {
    this.data.isDraft = true;
    this.data.publishedAt = null;
    return this;
  }

  /**
   * Mark post as published
   */
  published(): this {
    this.data.isDraft = false;
    this.data.publishedAt = this.data.publishedAt || new Date();
    return this;
  }

  /**
   * Mark post as pinned
   */
  pinned(): this {
    this.data.isPinned = true;
    return this;
  }

  /**
   * Set view count
   */
  withViewCount(count: number): this {
    this.data.viewCount = count;
    return this;
  }

  /**
   * Set like count
   */
  withLikeCount(count: number): this {
    this.data.likeCount = count;
    return this;
  }

  /**
   * Set comment count
   */
  withCommentCount(count: number): this {
    this.data.commentCount = count;
    return this;
  }

  /**
   * Mark post as deleted
   */
  deleted(): this {
    this.data.deletedAt = new Date();
    return this;
  }

  /**
   * Set created date
   */
  createdAt(date: Date): this {
    this.data.createdAt = date;
    return this;
  }

  /**
   * Set updated date
   */
  updatedAt(date: Date): this {
    this.data.updatedAt = date;
    return this;
  }

  /**
   * Create a popular post (high engagement)
   */
  popular(): this {
    this.data.viewCount = 1000;
    this.data.likeCount = 50;
    this.data.commentCount = 25;
    return this;
  }

  /**
   * Create a new post (recent)
   */
  recent(): this {
    const now = new Date();
    this.data.createdAt = now;
    this.data.updatedAt = now;
    return this;
  }

  /**
   * Create an old post
   */
  old(): this {
    const oldDate = new Date();
    oldDate.setFullYear(oldDate.getFullYear() - 1);
    this.data.createdAt = oldDate;
    this.data.updatedAt = oldDate;
    if (this.data.publishedAt) {
      this.data.publishedAt = oldDate;
    }
    return this;
  }

  /**
   * Build and return the post data
   */
  build(): PostData {
    return { ...this.data };
  }

  /**
   * Build multiple posts with incrementing IDs
   */
  static buildMany(count: number, customizer?: (builder: PostBuilder, index: number) => void): PostData[] {
    const posts: PostData[] = [];

    for (let i = 0; i < count; i++) {
      const builder = new PostBuilder();

      // Apply customization if provided
      if (customizer) {
        customizer(builder, i);
      }

      posts.push(builder.build());
    }

    return posts;
  }
}

/**
 * Quick factory functions for common scenarios
 */
export const PostTestData = {
  /**
   * Create a draft post
   */
  draft: (overrides?: Partial<PostData>): PostData => {
    const post = new PostBuilder().draft().build();
    return { ...post, ...overrides };
  },

  /**
   * Create a published post
   */
  published: (overrides?: Partial<PostData>): PostData => {
    const post = new PostBuilder().published().build();
    return { ...post, ...overrides };
  },

  /**
   * Create a pinned post
   */
  pinned: (overrides?: Partial<PostData>): PostData => {
    const post = new PostBuilder().published().pinned().build();
    return { ...post, ...overrides };
  },

  /**
   * Create a deleted post
   */
  deleted: (overrides?: Partial<PostData>): PostData => {
    const post = new PostBuilder().deleted().build();
    return { ...post, ...overrides };
  },

  /**
   * Create a popular post
   */
  popular: (overrides?: Partial<PostData>): PostData => {
    const post = new PostBuilder().published().popular().build();
    return { ...post, ...overrides };
  },

  /**
   * Create multiple posts
   */
  many: (count: number, overrides?: Partial<PostData>): PostData[] => {
    return PostBuilder.buildMany(count, (builder) => {
      if (overrides) {
        Object.entries(overrides).forEach(([key, value]) => {
          if (key === 'isDraft' && value === false) {
            builder.published();
          } else if (key === 'isPinned' && value === true) {
            builder.pinned();
          }
          // Add more specific mappings as needed
        });
      }
    });
  },
};

/**
 * Example Usage in Tests:
 *
 * // Simple usage
 * const post = PostTestData.draft();
 * const publishedPost = PostTestData.published();
 *
 * // With overrides
 * const myPost = PostTestData.published({
 *   title: 'My Custom Title',
 *   authorId: 'specific-author-id',
 * });
 *
 * // Builder pattern for complex scenarios
 * const complexPost = new PostBuilder()
 *   .withTitle('Important Announcement')
 *   .withCategory('announcements')
 *   .published()
 *   .pinned()
 *   .withLikeCount(100)
 *   .withCommentCount(50)
 *   .build();
 *
 * // Create multiple posts
 * const posts = PostTestData.many(5, { isDraft: false });
 *
 * // Custom multiple posts
 * const customPosts = PostBuilder.buildMany(3, (builder, index) => {
 *   builder
 *     .withTitle(`Post ${index + 1}`)
 *     .published()
 *     .withViewCount(index * 100);
 * });
 */
