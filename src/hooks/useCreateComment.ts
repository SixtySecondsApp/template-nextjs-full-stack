import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";

/**
 * Create Comment Request
 */
interface CreateCommentRequest {
  postId: string;
  body: string;
  parentId?: string | null;
}

/**
 * Create Comment Response
 */
interface CreateCommentResponse {
  success: boolean;
  data: {
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
    isLiked: boolean;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

/**
 * Create a new comment
 */
async function createComment(data: CreateCommentRequest): Promise<CreateCommentResponse> {
  const response = await fetch("/api/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create comment");
  }

  return response.json();
}

/**
 * Custom Hook: useCreateComment
 *
 * Create a comment or reply with automatic cache updates
 *
 * @example
 * ```tsx
 * const { mutate: createComment, isPending } = useCreateComment();
 *
 * <button
 *   onClick={() => createComment({
 *     postId: "post-123",
 *     body: "Great post!",
 *     parentId: null // or "comment-456" for a reply
 *   })}
 *   disabled={isPending}
 * >
 *   {isPending ? "Posting..." : "Post Comment"}
 * </button>
 * ```
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentRequest) => createComment(data),

    // Update cache after successful creation
    onSuccess: (data, variables) => {
      const { postId, parentId } = variables;

      // Invalidate the post detail query to refetch comments
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });

      // Also invalidate the posts list to update comment counts
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });

      // Optimistically update the post's comment count
      queryClient.setQueryData(
        queryKeys.posts.detail(postId),
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              commentCount: (oldData.data.commentCount || 0) + 1,
            },
          };
        }
      );

      // If this is a reply, we could also optimistically add it to the parent's replies
      // However, since we're invalidating the query, a refetch will happen automatically
    },

    // Handle errors
    onError: (error: Error) => {
      console.error("[useCreateComment] Error:", error);
    },
  });
}
