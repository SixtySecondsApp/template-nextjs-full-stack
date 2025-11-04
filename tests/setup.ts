/**
 * Vitest Global Setup File
 *
 * This file runs before all tests and sets up the testing environment.
 */

import { afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Extend Vitest matchers
import '@testing-library/jest-dom/vitest';

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Global setup
beforeAll(() => {
  // Mock environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/sixty_test';

  // Mock Clerk authentication
  vi.mock('@clerk/nextjs', () => ({
    auth: vi.fn(() => ({
      userId: 'test-user-id',
      sessionId: 'test-session-id',
      getToken: vi.fn(() => Promise.resolve('test-token')),
    })),
    currentUser: vi.fn(() =>
      Promise.resolve({
        id: 'test-user-id',
        emailAddresses: [{ emailAddress: 'test@example.com' }],
        firstName: 'Test',
        lastName: 'User',
      })
    ),
    ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
    SignIn: () => null,
    SignUp: () => null,
    UserButton: () => null,
  }));

  // Mock Next.js router
  vi.mock('next/navigation', () => ({
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
    }),
    usePathname: () => '/test-path',
    useSearchParams: () => new URLSearchParams(),
  }));

  // Mock Next.js Image component
  vi.mock('next/image', () => ({
    default: (props: any) => {
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      return <img {...props} />;
    },
  }));
});

// Global test utilities
declare global {
  var testUtils: {
    createMockUser: () => any;
    createMockPost: () => any;
    createMockComment: () => any;
  };
}

// Utility functions for creating test data
globalThis.testUtils = {
  createMockUser: () => ({
    id: `user-${Date.now()}`,
    clerkId: `clerk-${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    firstName: 'Test',
    lastName: 'User',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }),

  createMockPost: () => ({
    id: `post-${Date.now()}`,
    communityId: 'test-community',
    authorId: 'test-author',
    title: 'Test Post',
    body: '<p>Test content</p>',
    isDraft: false,
    isPinned: false,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    deletedAt: null,
  }),

  createMockComment: () => ({
    id: `comment-${Date.now()}`,
    postId: 'test-post',
    authorId: 'test-author',
    body: 'Test comment',
    likeCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }),
};
