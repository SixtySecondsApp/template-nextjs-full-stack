import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { LikeCommentUseCase } from "@/application/use-cases/comments/like-comment.usecase";
import { LikeRepositoryPrisma } from "@/infrastructure/repositories/like-repository.prisma";
import { CommentRepositoryPrisma } from "@/infrastructure/repositories/comment-repository.prisma";
import { LikeError } from "@/application/errors/post.errors";
import prisma from "@/lib/prisma";

/**
 * POST /api/comments/[id]/like
 * Toggle like on a comment (like if not liked, unlike if already liked)
 *
 * @auth Required - Clerk authentication
 * @param id - Comment ID
 * @returns 200 - { isLiked: boolean, likeCount: number }
 * @throws 401 - Unauthorized
 * @throws 404 - Comment not found
 * @throws 500 - Internal server error
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Clerk Authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Get comment ID from params
    const { id: commentId } = params;

    // 3. Execute use case
    const likeRepository = new LikeRepositoryPrisma(prisma);
    const commentRepository = new CommentRepositoryPrisma(prisma);
    const likeCommentUseCase = new LikeCommentUseCase(
      likeRepository,
      commentRepository
    );

    const result = await likeCommentUseCase.execute({
      userId,
      commentId,
    });

    // 4. Return success response
    return NextResponse.json(
      {
        success: true,
        data: result,
        message: result.isLiked ? "Comment liked" : "Comment unliked",
      },
      { status: 200 }
    );
  } catch (error) {
    // Use case errors
    if (error instanceof Error) {
      const errorMessage = error.message;

      // Map error enums to HTTP status codes
      switch (errorMessage) {
        case LikeError.COMMENT_NOT_FOUND:
          return NextResponse.json(
            { success: false, message: "Comment not found" },
            { status: 404 }
          );

        case LikeError.ALREADY_LIKED:
          return NextResponse.json(
            { success: false, message: "Comment already liked" },
            { status: 409 }
          );

        case LikeError.NOT_LIKED:
          return NextResponse.json(
            { success: false, message: "Comment not liked yet" },
            { status: 409 }
          );

        case LikeError.LIKE_FAILED:
          return NextResponse.json(
            { success: false, message: "Failed to like comment" },
            { status: 500 }
          );

        default:
          console.error("[POST /api/comments/[id]/like] Error:", error);
          return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 }
          );
      }
    }

    // Unknown errors
    console.error("[POST /api/comments/[id]/like] Unknown error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
