import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";

/**
 * Post Filter Types
 */
export type PostFilter = "all" | "new" | "active" | "top";

/**
 * Post List Query Parameters
 */
interface UsePostsParams {
  communityId: string;
  filter?: PostFilter;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

/**
 * Post DTO (matches backend response)
 */
export interface PostDTO {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  communityId: string;
  category: string | null;
  isPinned: boolean;
  isDraft: boolean;
  isSolved: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Paginated Posts Response
 */
interface PostsResponse {
  success: boolean;
  data: {
    posts: PostDTO[];
    total: number;
    hasMore: boolean;
    page: number;
    limit: number;
  };
}

/**
 * Fetch posts from API
 */
async function fetchPosts(params: UsePostsParams): Promise<PostsResponse> {
  const queryParams = new URLSearchParams({
    communityId: params.communityId,
    filter: params.filter || "all",
    page: String(params.page || 1),
    limit: String(params.limit || 20),
  });

  const response = await fetch(`/api/posts?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}

/**
 * Custom Hook: usePosts
 *
 * Fetches paginated list of posts with filters
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = usePosts({
 *   communityId: "community-123",
 *   filter: "new",
 *   page: 1,
 *   limit: 20
 * });
 * ```
 */
export function usePosts(params: UsePostsParams) {
  const { communityId, filter = "all", page = 1, limit = 20, enabled = true } = params;

  return useQuery({
    queryKey: queryKeys.posts.list({ communityId, filter, page, limit }),
    queryFn: () => fetchPosts({ communityId, filter, page, limit }),
    enabled: enabled && !!communityId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
