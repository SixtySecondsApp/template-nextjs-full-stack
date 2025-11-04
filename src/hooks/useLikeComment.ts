import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";

/**
 * Like Comment Response
 */
interface LikeCommentResponse {
  success: boolean;
  data: {
    isLiked: boolean;
    likeCount: number;
  };
  message: string;
}

/**
 * Toggle like on a comment
 */
async function toggleCommentLike(commentId: string): Promise<LikeCommentResponse> {
  const response = await fetch(`/api/comments/${commentId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to like comment");
  }

  return response.json();
}

/**
 * Custom Hook: useLikeComment
 *
 * Toggle like on a comment with optimistic UI updates
 *
 * @example
 * ```tsx
 * const { mutate: likeComment, isPending } = useLikeComment();
 *
 * <button
 *   onClick={() => likeComment({ commentId: "comment-123", postId: "post-123" })}
 *   disabled={isPending}
 * >
 *   {isPending ? "..." : comment.isLiked ? "Unlike" : "Like"} ({comment.likeCount})
 * </button>
 * ```
 */
export function useLikeComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { commentId: string; postId: string }) =>
      toggleCommentLike(params.commentId),

    // Optimistic update
    onMutate: async (params) => {
      const { commentId, postId } = params;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.detail(postId) });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKeys.posts.detail(postId));

      // Optimistically update the post's comments
      queryClient.setQueryData(
        queryKeys.posts.detail(postId),
        (oldData: any) => {
          if (!oldData?.data?.comments) return oldData;

          // Recursive function to update comment in tree
          const updateCommentInTree = (comments: any[]): any[] => {
            return comments.map((comment) => {
              if (comment.id === commentId) {
                const currentIsLiked = comment.isLiked || false;
                const currentLikeCount = comment.likeCount || 0;

                return {
                  ...comment,
                  isLiked: !currentIsLiked,
                  likeCount: currentIsLiked
                    ? Math.max(0, currentLikeCount - 1)
                    : currentLikeCount + 1,
                };
              }

              // Check nested replies
              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: updateCommentInTree(comment.replies),
                };
              }

              return comment;
            });
          };

          return {
            ...oldData,
            data: {
              ...oldData.data,
              comments: updateCommentInTree(oldData.data.comments),
            },
          };
        }
      );

      return { previousData, commentId, postId };
    },

    // Rollback on error
    onError: (err, params, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          queryKeys.posts.detail(context.postId),
          context.previousData
        );
      }

      console.error("[useLikeComment] Error:", err);
    },

    // Refetch after success/error
    onSettled: (data, error, params) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(params.postId) });
    },
  });
}
