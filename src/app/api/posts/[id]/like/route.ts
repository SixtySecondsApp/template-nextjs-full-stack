import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { LikePostUseCase } from "@/application/use-cases/posts/like-post.usecase";
import { LikeRepositoryPrisma } from "@/infrastructure/repositories/like-repository.prisma";
import { PostRepositoryPrisma } from "@/infrastructure/repositories/post-repository.prisma";
import { LikeError } from "@/application/errors/post.errors";
import prisma from "@/lib/prisma";

/**
 * POST /api/posts/[id]/like
 * Toggle like on a post (like if not liked, unlike if already liked)
 *
 * @auth Required - Clerk authentication
 * @param id - Post ID
 * @returns 200 - { isLiked: boolean, likeCount: number }
 * @throws 401 - Unauthorized
 * @throws 404 - Post not found
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

    // 2. Get post ID from params
    const { id: postId } = params;

    // 3. Execute use case
    const likeRepository = new LikeRepositoryPrisma(prisma);
    const postRepository = new PostRepositoryPrisma(prisma);
    const likePostUseCase = new LikePostUseCase(likeRepository, postRepository);

    const result = await likePostUseCase.execute({
      userId,
      postId,
    });

    // 4. Return success response
    return NextResponse.json(
      {
        success: true,
        data: result,
        message: result.isLiked ? "Post liked" : "Post unliked",
      },
      { status: 200 }
    );
  } catch (error) {
    // Use case errors
    if (error instanceof Error) {
      const errorMessage = error.message;

      // Map error enums to HTTP status codes
      switch (errorMessage) {
        case LikeError.POST_NOT_FOUND:
          return NextResponse.json(
            { success: false, message: "Post not found" },
            { status: 404 }
          );

        case LikeError.ALREADY_LIKED:
          return NextResponse.json(
            { success: false, message: "Post already liked" },
            { status: 409 }
          );

        case LikeError.NOT_LIKED:
          return NextResponse.json(
            { success: false, message: "Post not liked yet" },
            { status: 409 }
          );

        case LikeError.LIKE_FAILED:
          return NextResponse.json(
            { success: false, message: "Failed to like post" },
            { status: 500 }
          );

        default:
          console.error("[POST /api/posts/[id]/like] Error:", error);
          return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 }
          );
      }
    }

    // Unknown errors
    console.error("[POST /api/posts/[id]/like] Unknown error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
