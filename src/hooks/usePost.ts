import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";

/**
 * Comment DTO
 */
export interface CommentDTO {
  id: string;
  body: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  postId: string;
  parentId: string | null;
  likeCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: CommentDTO[]; // Nested replies for 2-level threading
}

/**
 * Post with Comments DTO
 */
export interface PostWithCommentsDTO {
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
  comments: CommentDTO[]; // Top-level comments with nested replies
}

/**
 * Post with Comments Response
 */
interface PostWithCommentsResponse {
  success: boolean;
  data: PostWithCommentsDTO;
}

/**
 * Fetch single post with comments
 */
async function fetchPost(postId: string): Promise<PostWithCommentsResponse> {
  const response = await fetch(`/api/posts/${postId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch post");
  }

  return response.json();
}

/**
 * Custom Hook: usePost
 *
 * Fetches a single post with comments (2-level threading)
 * Also increments view count automatically
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = usePost("post-123");
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 *
 * return (
 *   <div>
 *     <h1>{data.data.title}</h1>
 *     <div>{data.data.content}</div>
 *     <CommentThread comments={data.data.comments} />
 *   </div>
 * );
 * ```
 */
export function usePost(postId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.posts.detail(postId || ""),
    queryFn: () => fetchPost(postId!),
    enabled: !!postId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
