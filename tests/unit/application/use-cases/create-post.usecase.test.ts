/**
 * Application Layer Test Example: CreatePostUseCase
 *
 * Purpose: Test business logic orchestration with fake dependencies
 * Framework: Vitest with Fake Repositories
 * Coverage Target: >85%
 * Test Isolation: Use in-memory fake repositories
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FakePostRepository } from '../../../helpers/fake-repositories/fake-post.repository';

// Mock types (adjust based on actual implementation)
interface CreatePostDTO {
  communityId: string;
  authorId: string;
  title: string;
  body: string;
  category?: string;
  isDraft?: boolean;
}

interface PostResponseDTO {
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
}

// Example Use Case implementation
class CreatePostUseCase {
  constructor(
    private readonly postRepository: FakePostRepository,
    private readonly eventPublisher?: (event: any) => void
  ) {}

  async execute(input: CreatePostDTO): Promise<PostResponseDTO> {
    // Validation
    if (!input.title || input.title.trim().length === 0) {
      throw new Error('Post title is required');
    }

    if (input.title.length > 500) {
      throw new Error('Post title cannot exceed 500 characters');
    }

    if (!input.body || input.body.trim().length === 0) {
      throw new Error('Post body is required');
    }

    // Create post entity
    const post = {
      id: crypto.randomUUID(),
      communityId: input.communityId,
      authorId: input.authorId,
      title: input.title.trim(),
      body: input.body,
      isDraft: input.isDraft ?? true,
      category: input.category ?? null,
      isPinned: false,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: input.isDraft === false ? new Date() : null,
      deletedAt: null,
    };

    // Persist to repository
    const savedPost = await this.postRepository.create(post);

    // Publish domain event
    if (this.eventPublisher) {
      this.eventPublisher({
        type: 'POST_CREATED',
        postId: savedPost.id,
        communityId: savedPost.communityId,
        authorId: savedPost.authorId,
        occurredAt: new Date(),
      });
    }

    // Return DTO (without deletedAt)
    return {
      id: savedPost.id,
      communityId: savedPost.communityId,
      authorId: savedPost.authorId,
      title: savedPost.title,
      body: savedPost.body,
      isDraft: savedPost.isDraft,
      category: savedPost.category,
      isPinned: savedPost.isPinned,
      viewCount: savedPost.viewCount,
      likeCount: savedPost.likeCount,
      commentCount: savedPost.commentCount,
      createdAt: savedPost.createdAt,
      updatedAt: savedPost.updatedAt,
      publishedAt: savedPost.publishedAt,
    };
  }
}

describe('CreatePostUseCase (Application Layer)', () => {
  let fakePostRepository: FakePostRepository;
  let publishedEvents: any[];
  let useCase: CreatePostUseCase;

  beforeEach(() => {
    fakePostRepository = new FakePostRepository();
    publishedEvents = [];
    const eventPublisher = (event: any) => publishedEvents.push(event);
    useCase = new CreatePostUseCase(fakePostRepository, eventPublisher);
  });

  describe('successful post creation', () => {
    it('should create a new post and return DTO', async () => {
      const input: CreatePostDTO = {
        communityId: 'comm-123',
        authorId: 'user-123',
        title: 'Test Post Title',
        body: 'This is the post body content',
        category: 'general',
      };

      const result = await useCase.execute(input);

      expect(result).toHaveProperty('id');
      expect(result.title).toBe('Test Post Title');
      expect(result.body).toBe('This is the post body content');
      expect(result.communityId).toBe('comm-123');
      expect(result.authorId).toBe('user-123');
      expect(result.category).toBe('general');
      expect(result.isDraft).toBe(true); // Default value
      expect(result.isPinned).toBe(false);
      expect(result.viewCount).toBe(0);
      expect(result.likeCount).toBe(0);
      expect(result.commentCount).toBe(0);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should persist post to repository', async () => {
      const input: CreatePostDTO = {
        communityId: 'comm-123',
        authorId: 'user-123',
        title: 'Test Post',
        body: 'Content',
      };

      await useCase.execute(input);

      // Verify post was persisted
      const posts = await fakePostRepository.findAll();
      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe('Test Post');
    });

    it('should publish POST_CREATED event', async () => {
      const input: CreatePostDTO = {
        communityId: 'comm-123',
        authorId: 'user-123',
        title: 'Test Post',
        body: 'Content',
      };

      await useCase.execute(input);

      expect(publishedEvents).toHaveLength(1);
      expect(publishedEvents[0]).toMatchObject({
        type: 'POST_CREATED',
        communityId: 'comm-123',
        authorId: 'user-123',
      });
      expect(publishedEvents[0]).toHaveProperty('postId');
      expect(publishedEvents[0]).toHaveProperty('occurredAt');
    });

    it('should trim whitespace from title', async () => {
      const input: CreatePostDTO = {
        communityId: 'comm-123',
        authorId: 'user-123',
        title: '  Test Post  ',
        body: 'Content',
      };

      const result = await useCase.execute(input);

      expect(result.title).toBe('Test Post');
    });

    it('should create post with isDraft=false when specified', async () => {
      const input: CreatePostDTO = {
        communityId: 'comm-123',
        authorId: 'user-123',
        title: 'Published Post',
        body: 'Content',
        isDraft: false,
      };

      const result = await useCase.execute(input);

      expect(result.isDraft).toBe(false);
      expect(result.publishedAt).toBeInstanceOf(Date);
    });

    it('should set publishedAt to null for draft posts', async () => {
      const input: CreatePostDTO = {
        communityId: 'comm-123',
        authorId: 'user-123',
        title: 'Draft Post',
        body: 'Content',
        isDraft: true,
      };

      const result = await useCase.execute(input);

      expect(result.isDraft).toBe(true);
      expect(result.publishedAt).toBeNull();
    });
  });

  describe('validation errors', () => {
    it('should throw error for empty title', async () => {
      const input: CreatePostDTO = {
        communityId: 'comm-123',
        authorId: 'user-123',
        title: '',
        body: 'Content',
      };

      await expect(useCase.execute(input)).rejects.toThrow(
        'Post title is required'
      );
    });

    it('should throw error for whitespace-only title', async () => {
      const input: CreatePostDTO = {
        communityId: 'comm-123',
        authorId: 'user-123',
        title: '   ',
        body: 'Content',
      };

      await expect(useCase.execute(input)).rejects.toThrow(
        'Post title is required'
      );
    });

    it('should throw error for title exceeding 500 characters', async () => {
      const input: CreatePostDTO = {
        communityId: 'comm-123',
        authorId: 'user-123',
        title: 'a'.repeat(501),
        body: 'Content',
      };

      await expect(useCase.execute(input)).rejects.toThrow(
        'Post title cannot exceed 500 characters'
      );
    });

    it('should throw error for empty body', async () => {
      const input: CreatePostDTO = {
        communityId: 'comm-123',
        authorId: 'user-123',
        title: 'Title',
        body: '',
      };

      await expect(useCase.execute(input)).rejects.toThrow(
        'Post body is required'
      );
    });

    it('should throw error for whitespace-only body', async () => {
      const input: CreatePostDTO = {
        communityId: 'comm-123',
        authorId: 'user-123',
        title: 'Title',
        body: '   ',
      };

      await expect(useCase.execute(input)).rejects.toThrow(
        'Post body is required'
      );
    });
  });

  describe('repository interaction', () => {
    it('should not persist post when validation fails', async () => {
      const input: CreatePostDTO = {
        communityId: 'comm-123',
        authorId: 'user-123',
        title: '',
        body: 'Content',
      };

      try {
        await useCase.execute(input);
      } catch {
        // Expected error
      }

      // Verify no post was persisted
      const posts = await fakePostRepository.findAll();
      expect(posts).toHaveLength(0);
    });

    it('should handle repository errors gracefully', async () => {
      // Mock repository to throw error
      vi.spyOn(fakePostRepository, 'create').mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      const input: CreatePostDTO = {
        communityId: 'comm-123',
        authorId: 'user-123',
        title: 'Test Post',
        body: 'Content',
      };

      await expect(useCase.execute(input)).rejects.toThrow(
        'Database connection failed'
      );
    });
  });

  describe('optional fields', () => {
    it('should handle missing category field', async () => {
      const input: CreatePostDTO = {
        communityId: 'comm-123',
        authorId: 'user-123',
        title: 'Test Post',
        body: 'Content',
        // category not provided
      };

      const result = await useCase.execute(input);

      expect(result.category).toBeNull();
    });

    it('should default isDraft to true when not specified', async () => {
      const input: CreatePostDTO = {
        communityId: 'comm-123',
        authorId: 'user-123',
        title: 'Test Post',
        body: 'Content',
        // isDraft not provided
      };

      const result = await useCase.execute(input);

      expect(result.isDraft).toBe(true);
    });
  });

  describe('event publishing', () => {
    it('should work without event publisher', async () => {
      const useCaseWithoutEvents = new CreatePostUseCase(fakePostRepository);

      const input: CreatePostDTO = {
        communityId: 'comm-123',
        authorId: 'user-123',
        title: 'Test Post',
        body: 'Content',
      };

      const result = await useCaseWithoutEvents.execute(input);

      expect(result).toBeDefined();
      expect(publishedEvents).toHaveLength(0);
    });
  });
});
