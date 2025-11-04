import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys, optimisticUpdates } from "@/lib/react-query";

/**
 * Like Response DTO (matches backend response)
 */
interface LikeResponse {
  success: boolean;
  data: {
    isLiked: boolean;
    likeCount: number;
  };
  message: string;
}

/**
 * Like Post Mutation Parameters
 */
interface LikePostParams {
  postId: string;
}

/**
 * Toggle like on a post
 */
async function toggleLike(postId: string): Promise<LikeResponse> {
  const response = await fetch(`/api/posts/${postId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to like post");
  }

  return response.json();
}

/**
 * Custom Hook: useLikePost
 *
 * Toggle like on a post with optimistic UI updates
 *
 * @example
 * ```tsx
 * const { mutate: likePost, isPending } = useLikePost();
 *
 * <button onClick={() => likePost({ postId: "post-123" })}>
 *   {isPending ? "Loading..." : "Like"}
 * </button>
 * ```
 */
export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: LikePostParams) => toggleLike(params.postId),

    // Optimistic update - Update UI immediately before server responds
    onMutate: async (params) => {
      const { postId } = params;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.detail(postId) });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKeys.posts.detail(postId));

      // Optimistically update the cache
      queryClient.setQueryData(
        queryKeys.posts.detail(postId),
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          const currentIsLiked = oldData.data.isLiked || false;
          const currentLikeCount = oldData.data.likeCount || 0;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              isLiked: !currentIsLiked,
              likeCount: currentIsLiked
                ? Math.max(0, currentLikeCount - 1)
                : currentLikeCount + 1,
            },
          };
        }
      );

      // Also update in the posts list if cached
      queryClient.setQueriesData(
        { queryKey: queryKeys.posts.lists() },
        (oldData: any) => {
          if (!oldData?.data?.posts) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              posts: oldData.data.posts.map((post: any) => {
                if (post.id === postId) {
                  const currentIsLiked = post.isLiked || false;
                  const currentLikeCount = post.likeCount || 0;

                  return {
                    ...post,
                    isLiked: !currentIsLiked,
                    likeCount: currentIsLiked
                      ? Math.max(0, currentLikeCount - 1)
                      : currentLikeCount + 1,
                  };
                }
                return post;
              }),
            },
          };
        }
      );

      // Return context with previous data for rollback
      return { previousData, postId };
    },

    // If mutation fails, rollback to previous state
    onError: (err, params, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          queryKeys.posts.detail(context.postId),
          context.previousData
        );
      }

      console.error("[useLikePost] Error:", err);
    },

    // Always refetch after error or success to sync with server
    onSettled: (data, error, params) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(params.postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
    },
  });
}
