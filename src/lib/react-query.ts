import { QueryClient, DefaultOptions } from "@tanstack/react-query";

/**
 * React Query Configuration
 *
 * Default options for all queries and mutations
 */
const queryConfig: DefaultOptions = {
  queries: {
    // Refetch on window focus (useful for real-time updates)
    refetchOnWindowFocus: false,

    // Retry failed requests
    retry: 1,

    // Stale time: Data considered fresh for 5 minutes
    staleTime: 5 * 60 * 1000,

    // Cache time: Keep unused data in cache for 10 minutes
    gcTime: 10 * 60 * 1000,

    // Refetch on mount if data is stale
    refetchOnMount: true,
  },
  mutations: {
    // Retry mutations once on failure
    retry: 1,
  },
};

/**
 * Create Query Client Instance
 *
 * Singleton pattern - create once and reuse
 */
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

/**
 * Query Keys Factory
 *
 * Centralized query key management for cache invalidation
 */
export const queryKeys = {
  // Posts
  posts: {
    all: ["posts"] as const,
    lists: () => [...queryKeys.posts.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
    drafts: () => [...queryKeys.posts.all, "drafts"] as const,
  },

  // Comments
  comments: {
    all: ["comments"] as const,
    byPost: (postId: string) => [...queryKeys.comments.all, "post", postId] as const,
  },

  // Likes
  likes: {
    all: ["likes"] as const,
    post: (postId: string) => [...queryKeys.likes.all, "post", postId] as const,
    comment: (commentId: string) => [...queryKeys.likes.all, "comment", commentId] as const,
  },

  // Community
  community: {
    all: ["community"] as const,
    stats: (communityId: string) => [...queryKeys.community.all, "stats", communityId] as const,
    leaderboard: (communityId: string, limit: number) =>
      [...queryKeys.community.all, "leaderboard", communityId, limit] as const,
  },

  // Search
  search: {
    all: ["search"] as const,
    query: (query: string, type: string) => [...queryKeys.search.all, query, type] as const,
  },

  // Users
  users: {
    all: ["users"] as const,
    detail: (id: string) => [...queryKeys.users.all, id] as const,
  },
};

/**
 * Cache Invalidation Helpers
 *
 * Common cache invalidation patterns
 */
export const cacheInvalidation = {
  /**
   * Invalidate all posts queries
   */
  invalidatePosts: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
  },

  /**
   * Invalidate specific post detail
   */
  invalidatePost: (postId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });
  },

  /**
   * Invalidate post list with filters
   */
  invalidatePostList: (filters?: Record<string, unknown>) => {
    if (filters) {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.list(filters) });
    } else {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
    }
  },

  /**
   * Invalidate comments for a post
   */
  invalidateComments: (postId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.comments.byPost(postId) });
  },

  /**
   * Invalidate community stats
   */
  invalidateCommunityStats: (communityId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.community.stats(communityId) });
  },

  /**
   * Invalidate leaderboard
   */
  invalidateLeaderboard: (communityId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.community.leaderboard(communityId, 5) });
  },
};

/**
 * Optimistic Update Helpers
 *
 * Common optimistic update patterns for better UX
 */
export const optimisticUpdates = {
  /**
   * Optimistic like update
   */
  likePost: (postId: string, isLiked: boolean, likeCount: number) => {
    queryClient.setQueryData(
      queryKeys.posts.detail(postId),
      (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          isLiked,
          likeCount,
        };
      }
    );
  },

  /**
   * Optimistic comment count update
   */
  updateCommentCount: (postId: string, increment: number) => {
    queryClient.setQueryData(
      queryKeys.posts.detail(postId),
      (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          commentCount: (oldData.commentCount || 0) + increment,
        };
      }
    );
  },
};
