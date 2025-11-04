/**
 * Presentation Layer Test Example: Post API E2E Tests
 *
 * Purpose: Test complete request/response flow through API routes
 * Framework: Playwright
 * Coverage Target: >75% for critical flows
 * Test Isolation: Test database + Clerk test mode
 */

import { test, expect } from '@playwright/test';

test.describe('Post API (E2E)', () => {
  // Test data
  let testUserId: string;
  let testCommunityId: string;
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    // Setup: Create test user and community
    // Note: Adjust based on your actual test data setup strategy

    // In real implementation, you would:
    // 1. Sign in with Clerk test user
    // 2. Get auth token
    // 3. Create test community
    // For now, using placeholder values
  });

  test.beforeEach(async ({ request }) => {
    // Clean database before each test
    await request.post('/api/test/reset-posts');
  });

  test.describe('POST /api/posts', () => {
    test('should create a new post', async ({ request }) => {
      const response = await request.post('/api/posts', {
        data: {
          title: 'Test Post Title',
          body: '<p>Test post content</p>',
          communityId: 'test-community-id',
          category: 'general',
        },
      });

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(201);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data).toHaveProperty('id');
      expect(json.data.title).toBe('Test Post Title');
      expect(json.data.body).toBe('<p>Test post content</p>');
      expect(json.data.category).toBe('general');
      expect(json.data.isDraft).toBe(true); // Default
      expect(json.data).toHaveProperty('createdAt');
    });

    test('should create published post when isDraft=false', async ({ request }) => {
      const response = await request.post('/api/posts', {
        data: {
          title: 'Published Post',
          body: '<p>Content</p>',
          communityId: 'test-community-id',
          isDraft: false,
        },
      });

      expect(response.ok()).toBeTruthy();

      const json = await response.json();
      expect(json.data.isDraft).toBe(false);
      expect(json.data.publishedAt).not.toBeNull();
    });

    test('should return 400 for missing title', async ({ request }) => {
      const response = await request.post('/api/posts', {
        data: {
          // title missing
          body: '<p>Content</p>',
          communityId: 'test-community-id',
        },
      });

      expect(response.status()).toBe(400);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.errors).toBeDefined();
      expect(json.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'title',
            message: expect.stringContaining('required'),
          }),
        ])
      );
    });

    test('should return 400 for missing body', async ({ request }) => {
      const response = await request.post('/api/posts', {
        data: {
          title: 'Test Post',
          // body missing
          communityId: 'test-community-id',
        },
      });

      expect(response.status()).toBe(400);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.errors).toBeDefined();
    });

    test('should return 400 for empty title', async ({ request }) => {
      const response = await request.post('/api/posts', {
        data: {
          title: '',
          body: '<p>Content</p>',
          communityId: 'test-community-id',
        },
      });

      expect(response.status()).toBe(400);
    });

    test('should return 400 for title exceeding 500 characters', async ({ request }) => {
      const response = await request.post('/api/posts', {
        data: {
          title: 'a'.repeat(501),
          body: '<p>Content</p>',
          communityId: 'test-community-id',
        },
      });

      expect(response.status()).toBe(400);
    });

    test('should return 401 for unauthenticated request', async ({ request }) => {
      const response = await request.post('/api/posts', {
        data: {
          title: 'Test Post',
          body: '<p>Content</p>',
          communityId: 'test-community-id',
        },
        headers: {
          // No authorization header
        },
      });

      expect(response.status()).toBe(401);
    });
  });

  test.describe('GET /api/posts', () => {
    test('should return list of posts', async ({ request }) => {
      // Setup: Create test posts
      await request.post('/api/posts', {
        data: {
          title: 'Post 1',
          body: '<p>Content 1</p>',
          communityId: 'test-community-id',
        },
      });
      await request.post('/api/posts', {
        data: {
          title: 'Post 2',
          body: '<p>Content 2</p>',
          communityId: 'test-community-id',
        },
      });

      const response = await request.get('/api/posts?communityId=test-community-id');

      expect(response.ok()).toBeTruthy();

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.posts).toHaveLength(2);
      expect(json.data).toHaveProperty('pagination');
      expect(json.data.pagination).toHaveProperty('total');
      expect(json.data.pagination).toHaveProperty('page');
      expect(json.data.pagination).toHaveProperty('pageSize');
    });

    test('should filter by communityId', async ({ request }) => {
      // Create posts in different communities
      await request.post('/api/posts', {
        data: {
          title: 'Community 1 Post',
          body: '<p>Content</p>',
          communityId: 'community-1',
        },
      });
      await request.post('/api/posts', {
        data: {
          title: 'Community 2 Post',
          body: '<p>Content</p>',
          communityId: 'community-2',
        },
      });

      const response = await request.get('/api/posts?communityId=community-1');

      const json = await response.json();
      expect(json.data.posts).toHaveLength(1);
      expect(json.data.posts[0].title).toBe('Community 1 Post');
    });

    test('should support pagination', async ({ request }) => {
      // Create multiple posts
      for (let i = 1; i <= 15; i++) {
        await request.post('/api/posts', {
          data: {
            title: `Post ${i}`,
            body: `<p>Content ${i}</p>`,
            communityId: 'test-community-id',
          },
        });
      }

      const response = await request.get(
        '/api/posts?communityId=test-community-id&page=1&pageSize=10'
      );

      const json = await response.json();
      expect(json.data.posts).toHaveLength(10);
      expect(json.data.pagination.total).toBe(15);
      expect(json.data.pagination.page).toBe(1);
      expect(json.data.pagination.totalPages).toBe(2);
    });

    test('should exclude soft-deleted posts', async ({ request }) => {
      // Create and delete a post
      const createResponse = await request.post('/api/posts', {
        data: {
          title: 'To Be Deleted',
          body: '<p>Content</p>',
          communityId: 'test-community-id',
        },
      });
      const { data: post } = await createResponse.json();

      await request.delete(`/api/posts/${post.id}`);

      // List posts
      const response = await request.get('/api/posts?communityId=test-community-id');

      const json = await response.json();
      expect(json.data.posts.find((p: any) => p.id === post.id)).toBeUndefined();
    });
  });

  test.describe('GET /api/posts/:id', () => {
    test('should return single post', async ({ request }) => {
      // Create post
      const createResponse = await request.post('/api/posts', {
        data: {
          title: 'Test Post',
          body: '<p>Content</p>',
          communityId: 'test-community-id',
        },
      });
      const { data: post } = await createResponse.json();

      const response = await request.get(`/api/posts/${post.id}`);

      expect(response.ok()).toBeTruthy();

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.id).toBe(post.id);
      expect(json.data.title).toBe('Test Post');
    });

    test('should return 404 for non-existent post', async ({ request }) => {
      const response = await request.get('/api/posts/non-existent-id');

      expect(response.status()).toBe(404);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.message).toContain('not found');
    });

    test('should return 404 for soft-deleted post', async ({ request }) => {
      // Create and delete post
      const createResponse = await request.post('/api/posts', {
        data: {
          title: 'To Be Deleted',
          body: '<p>Content</p>',
          communityId: 'test-community-id',
        },
      });
      const { data: post } = await createResponse.json();

      await request.delete(`/api/posts/${post.id}`);

      // Try to get deleted post
      const response = await request.get(`/api/posts/${post.id}`);

      expect(response.status()).toBe(404);
    });

    test('should increment view count', async ({ request }) => {
      // Create post
      const createResponse = await request.post('/api/posts', {
        data: {
          title: 'Test Post',
          body: '<p>Content</p>',
          communityId: 'test-community-id',
        },
      });
      const { data: post } = await createResponse.json();

      // View post multiple times
      await request.get(`/api/posts/${post.id}`);
      await request.get(`/api/posts/${post.id}`);

      const response = await request.get(`/api/posts/${post.id}`);
      const json = await response.json();

      expect(json.data.viewCount).toBeGreaterThanOrEqual(2);
    });
  });

  test.describe('PATCH /api/posts/:id', () => {
    test('should update post', async ({ request }) => {
      // Create post
      const createResponse = await request.post('/api/posts', {
        data: {
          title: 'Original Title',
          body: '<p>Original Content</p>',
          communityId: 'test-community-id',
        },
      });
      const { data: post } = await createResponse.json();

      const response = await request.patch(`/api/posts/${post.id}`, {
        data: {
          title: 'Updated Title',
          body: '<p>Updated Content</p>',
        },
      });

      expect(response.ok()).toBeTruthy();

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.title).toBe('Updated Title');
      expect(json.data.body).toBe('<p>Updated Content</p>');
    });

    test('should only update provided fields', async ({ request }) => {
      // Create post
      const createResponse = await request.post('/api/posts', {
        data: {
          title: 'Original Title',
          body: '<p>Original Content</p>',
          communityId: 'test-community-id',
          category: 'general',
        },
      });
      const { data: post } = await createResponse.json();

      const response = await request.patch(`/api/posts/${post.id}`, {
        data: {
          title: 'Updated Title',
          // body and category not changed
        },
      });

      const json = await response.json();
      expect(json.data.title).toBe('Updated Title');
      expect(json.data.body).toBe('<p>Original Content</p>');
      expect(json.data.category).toBe('general');
    });

    test('should return 404 for non-existent post', async ({ request }) => {
      const response = await request.patch('/api/posts/non-existent-id', {
        data: { title: 'Updated' },
      });

      expect(response.status()).toBe(404);
    });

    test('should return 400 for invalid data', async ({ request }) => {
      // Create post
      const createResponse = await request.post('/api/posts', {
        data: {
          title: 'Test Post',
          body: '<p>Content</p>',
          communityId: 'test-community-id',
        },
      });
      const { data: post } = await createResponse.json();

      const response = await request.patch(`/api/posts/${post.id}`, {
        data: {
          title: '', // Empty title
        },
      });

      expect(response.status()).toBe(400);
    });

    test('should return 403 for unauthorized user', async ({ request }) => {
      // Create post as one user
      const createResponse = await request.post('/api/posts', {
        data: {
          title: 'Test Post',
          body: '<p>Content</p>',
          communityId: 'test-community-id',
        },
      });
      const { data: post } = await createResponse.json();

      // Try to update as different user
      const response = await request.patch(`/api/posts/${post.id}`, {
        data: { title: 'Hacked Title' },
        headers: {
          Authorization: 'Bearer different-user-token',
        },
      });

      expect(response.status()).toBe(403);
    });
  });

  test.describe('DELETE /api/posts/:id', () => {
    test('should soft delete post', async ({ request }) => {
      // Create post
      const createResponse = await request.post('/api/posts', {
        data: {
          title: 'To Be Deleted',
          body: '<p>Content</p>',
          communityId: 'test-community-id',
        },
      });
      const { data: post } = await createResponse.json();

      const response = await request.delete(`/api/posts/${post.id}`);

      expect(response.status()).toBe(204);

      // Verify post is not in list
      const listResponse = await request.get('/api/posts?communityId=test-community-id');
      const { data } = await listResponse.json();
      expect(data.posts.find((p: any) => p.id === post.id)).toBeUndefined();
    });

    test('should return 404 for non-existent post', async ({ request }) => {
      const response = await request.delete('/api/posts/non-existent-id');

      expect(response.status()).toBe(404);
    });

    test('should return 403 for unauthorized user', async ({ request }) => {
      // Create post
      const createResponse = await request.post('/api/posts', {
        data: {
          title: 'Test Post',
          body: '<p>Content</p>',
          communityId: 'test-community-id',
        },
      });
      const { data: post } = await createResponse.json();

      // Try to delete as different user
      const response = await request.delete(`/api/posts/${post.id}`, {
        headers: {
          Authorization: 'Bearer different-user-token',
        },
      });

      expect(response.status()).toBe(403);
    });
  });

  test.describe('POST /api/posts/:id/publish', () => {
    test('should publish draft post', async ({ request }) => {
      // Create draft post
      const createResponse = await request.post('/api/posts', {
        data: {
          title: 'Draft Post',
          body: '<p>Content</p>',
          communityId: 'test-community-id',
          isDraft: true,
        },
      });
      const { data: post } = await createResponse.json();

      const response = await request.post(`/api/posts/${post.id}/publish`);

      expect(response.ok()).toBeTruthy();

      const json = await response.json();
      expect(json.data.isDraft).toBe(false);
      expect(json.data.publishedAt).not.toBeNull();
    });

    test('should return 400 for already published post', async ({ request }) => {
      // Create published post
      const createResponse = await request.post('/api/posts', {
        data: {
          title: 'Published Post',
          body: '<p>Content</p>',
          communityId: 'test-community-id',
          isDraft: false,
        },
      });
      const { data: post } = await createResponse.json();

      const response = await request.post(`/api/posts/${post.id}/publish`);

      expect(response.status()).toBe(400);
    });
  });
});
