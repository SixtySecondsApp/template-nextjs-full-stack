/**
 * Infrastructure Layer Test Example: PostRepositoryPrisma
 *
 * Purpose: Test repository implementations with real Prisma + test database
 * Framework: Vitest with Test Database
 * Coverage Target: >80%
 * Test Isolation: Test database with setup/teardown
 */

import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient({
  datasourceUrl: process.env.TEST_DATABASE_URL,
});

// Mock Post entity type
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

// Example Repository Implementation
class PostRepositoryPrisma {
  async create(post: Post): Promise<Post> {
    const created = await prisma.post.create({
      data: {
        id: post.id,
        communityId: post.communityId,
        authorId: post.authorId,
        title: post.title,
        body: post.body,
        isDraft: post.isDraft,
        category: post.category,
        isPinned: post.isPinned,
        viewCount: post.viewCount,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        publishedAt: post.publishedAt,
        deletedAt: post.deletedAt,
      },
    });

    return {
      ...created,
      category: created.category || null,
      publishedAt: created.publishedAt || null,
      deletedAt: created.deletedAt || null,
    };
  }

  async findById(id: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: {
        id,
        deletedAt: null, // Exclude soft-deleted
      },
    });

    if (!post) return null;

    return {
      ...post,
      category: post.category || null,
      publishedAt: post.publishedAt || null,
      deletedAt: post.deletedAt || null,
    };
  }

  async findAll(filters?: {
    communityId?: string;
    authorId?: string;
    isDraft?: boolean;
  }): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: {
        deletedAt: null, // Exclude soft-deleted
        communityId: filters?.communityId,
        authorId: filters?.authorId,
        isDraft: filters?.isDraft,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts.map((post) => ({
      ...post,
      category: post.category || null,
      publishedAt: post.publishedAt || null,
      deletedAt: post.deletedAt || null,
    }));
  }

  async update(post: Post): Promise<Post> {
    const updated = await prisma.post.update({
      where: { id: post.id },
      data: {
        title: post.title,
        body: post.body,
        isDraft: post.isDraft,
        category: post.category,
        isPinned: post.isPinned,
        viewCount: post.viewCount,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        publishedAt: post.publishedAt,
        updatedAt: new Date(),
      },
    });

    return {
      ...updated,
      category: updated.category || null,
      publishedAt: updated.publishedAt || null,
      deletedAt: updated.deletedAt || null,
    };
  }

  async softDelete(id: string): Promise<void> {
    await prisma.post.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async restore(id: string): Promise<void> {
    await prisma.post.update({
      where: { id },
      data: {
        deletedAt: null,
        updatedAt: new Date(),
      },
    });
  }
}

describe('PostRepositoryPrisma (Integration)', () => {
  let repository: PostRepositoryPrisma;
  let testCommunityId: string;
  let testUserId: string;

  beforeAll(async () => {
    // Setup test community and user
    const user = await prisma.user.create({
      data: {
        clerkId: `test-clerk-${Date.now()}`,
        email: `test-${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'User',
      },
    });
    testUserId = user.id;

    const community = await prisma.community.create({
      data: {
        name: 'Test Community',
        slug: `test-community-${Date.now()}`,
      },
    });
    testCommunityId = community.id;
  });

  beforeEach(async () => {
    repository = new PostRepositoryPrisma();
    // Clean posts before each test
    await prisma.post.deleteMany();
  });

  afterEach(async () => {
    // Clean up after each test
    await prisma.post.deleteMany();
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.post.deleteMany();
    await prisma.community.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('should persist post to database', async () => {
      const post: Post = {
        id: crypto.randomUUID(),
        communityId: testCommunityId,
        authorId: testUserId,
        title: 'Test Post',
        body: 'Test content',
        isDraft: true,
        category: 'general',
        isPinned: false,
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: null,
        deletedAt: null,
      };

      const result = await repository.create(post);

      expect(result.id).toBe(post.id);
      expect(result.title).toBe('Test Post');

      // Verify in database
      const dbPost = await prisma.post.findUnique({
        where: { id: post.id },
      });
      expect(dbPost).not.toBeNull();
      expect(dbPost?.title).toBe('Test Post');
    });

    it('should store all post properties correctly', async () => {
      const now = new Date();
      const post: Post = {
        id: crypto.randomUUID(),
        communityId: testCommunityId,
        authorId: testUserId,
        title: 'Complete Post',
        body: '<p>Rich text content</p>',
        isDraft: false,
        category: 'announcements',
        isPinned: true,
        viewCount: 10,
        likeCount: 5,
        commentCount: 3,
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
        deletedAt: null,
      };

      const result = await repository.create(post);

      expect(result).toMatchObject({
        title: 'Complete Post',
        body: '<p>Rich text content</p>',
        isDraft: false,
        category: 'announcements',
        isPinned: true,
        viewCount: 10,
        likeCount: 5,
        commentCount: 3,
      });
      expect(result.publishedAt).toBeInstanceOf(Date);
    });
  });

  describe('findById', () => {
    it('should return post if exists and not deleted', async () => {
      const post = await prisma.post.create({
        data: {
          communityId: testCommunityId,
          authorId: testUserId,
          title: 'Test Post',
          body: 'Content',
          deletedAt: null,
        },
      });

      const result = await repository.findById(post.id);

      expect(result).not.toBeNull();
      expect(result?.title).toBe('Test Post');
    });

    it('should return null for soft-deleted post', async () => {
      const post = await prisma.post.create({
        data: {
          communityId: testCommunityId,
          authorId: testUserId,
          title: 'Deleted Post',
          body: 'Content',
          deletedAt: new Date(),
        },
      });

      const result = await repository.findById(post.id);

      expect(result).toBeNull();
    });

    it('should return null for non-existent post', async () => {
      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      // Create test posts
      await prisma.post.createMany({
        data: [
          {
            communityId: testCommunityId,
            authorId: testUserId,
            title: 'Post 1',
            body: 'Content 1',
            isDraft: false,
            deletedAt: null,
          },
          {
            communityId: testCommunityId,
            authorId: testUserId,
            title: 'Post 2',
            body: 'Content 2',
            isDraft: true,
            deletedAt: null,
          },
          {
            communityId: testCommunityId,
            authorId: testUserId,
            title: 'Post 3 (Deleted)',
            body: 'Content 3',
            isDraft: false,
            deletedAt: new Date(),
          },
        ],
      });
    });

    it('should return all non-deleted posts', async () => {
      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result.map((p) => p.title)).not.toContain('Post 3 (Deleted)');
    });

    it('should filter by communityId', async () => {
      const otherCommunity = await prisma.community.create({
        data: {
          name: 'Other Community',
          slug: `other-community-${Date.now()}`,
        },
      });

      await prisma.post.create({
        data: {
          communityId: otherCommunity.id,
          authorId: testUserId,
          title: 'Other Post',
          body: 'Content',
        },
      });

      const result = await repository.findAll({
        communityId: testCommunityId,
      });

      expect(result).toHaveLength(2);
      expect(result.every((p) => p.communityId === testCommunityId)).toBe(true);
    });

    it('should filter by isDraft', async () => {
      const result = await repository.findAll({ isDraft: false });

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Post 1');
    });

    it('should filter by authorId', async () => {
      const result = await repository.findAll({ authorId: testUserId });

      expect(result).toHaveLength(2);
      expect(result.every((p) => p.authorId === testUserId)).toBe(true);
    });
  });

  describe('update', () => {
    it('should update post properties', async () => {
      const post = await prisma.post.create({
        data: {
          communityId: testCommunityId,
          authorId: testUserId,
          title: 'Original Title',
          body: 'Original Content',
          isDraft: true,
        },
      });

      const updated: Post = {
        ...post,
        title: 'Updated Title',
        body: 'Updated Content',
        isDraft: false,
        publishedAt: new Date(),
        category: null,
        deletedAt: null,
      };

      const result = await repository.update(updated);

      expect(result.title).toBe('Updated Title');
      expect(result.body).toBe('Updated Content');
      expect(result.isDraft).toBe(false);

      // Verify in database
      const dbPost = await prisma.post.findUnique({
        where: { id: post.id },
      });
      expect(dbPost?.title).toBe('Updated Title');
    });

    it('should update timestamps', async () => {
      const post = await prisma.post.create({
        data: {
          communityId: testCommunityId,
          authorId: testUserId,
          title: 'Test Post',
          body: 'Content',
        },
      });

      const originalUpdatedAt = post.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated: Post = {
        ...post,
        title: 'Updated Title',
        category: null,
        publishedAt: null,
        deletedAt: null,
      };

      await repository.update(updated);

      const dbPost = await prisma.post.findUnique({
        where: { id: post.id },
      });

      expect(dbPost?.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime()
      );
    });
  });

  describe('softDelete', () => {
    it('should set deletedAt timestamp', async () => {
      const post = await prisma.post.create({
        data: {
          communityId: testCommunityId,
          authorId: testUserId,
          title: 'Test Post',
          body: 'Content',
          deletedAt: null,
        },
      });

      await repository.softDelete(post.id);

      const dbPost = await prisma.post.findUnique({
        where: { id: post.id },
      });

      expect(dbPost?.deletedAt).toBeInstanceOf(Date);
    });

    it('should not return soft-deleted post in findById', async () => {
      const post = await prisma.post.create({
        data: {
          communityId: testCommunityId,
          authorId: testUserId,
          title: 'Test Post',
          body: 'Content',
        },
      });

      await repository.softDelete(post.id);

      const result = await repository.findById(post.id);

      expect(result).toBeNull();
    });

    it('should not return soft-deleted post in findAll', async () => {
      await prisma.post.create({
        data: {
          communityId: testCommunityId,
          authorId: testUserId,
          title: 'Post 1',
          body: 'Content',
        },
      });

      const post2 = await prisma.post.create({
        data: {
          communityId: testCommunityId,
          authorId: testUserId,
          title: 'Post 2',
          body: 'Content',
        },
      });

      await repository.softDelete(post2.id);

      const result = await repository.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Post 1');
    });
  });

  describe('restore', () => {
    it('should clear deletedAt timestamp', async () => {
      const post = await prisma.post.create({
        data: {
          communityId: testCommunityId,
          authorId: testUserId,
          title: 'Test Post',
          body: 'Content',
          deletedAt: new Date(),
        },
      });

      await repository.restore(post.id);

      const dbPost = await prisma.post.findUnique({
        where: { id: post.id },
      });

      expect(dbPost?.deletedAt).toBeNull();
    });

    it('should make restored post available in findById', async () => {
      const post = await prisma.post.create({
        data: {
          communityId: testCommunityId,
          authorId: testUserId,
          title: 'Test Post',
          body: 'Content',
          deletedAt: new Date(),
        },
      });

      await repository.restore(post.id);

      const result = await repository.findById(post.id);

      expect(result).not.toBeNull();
      expect(result?.title).toBe('Test Post');
    });
  });
});
