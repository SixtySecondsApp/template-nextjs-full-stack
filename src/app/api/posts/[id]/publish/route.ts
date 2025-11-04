import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { PublishPostUseCase } from "@/application/use-cases/posts/publish-post.usecase";
import { PostRepositoryPrisma } from "@/infrastructure/repositories";
import { PostError } from "@/application/errors/post.errors";

/**
 * API Route: POST /api/posts/[id]/publish
 * Publish a draft post (change status from DRAFT to PUBLISHED).
 *
 * Architecture:
 * - Thin controller layer
 * - Delegates to PublishPostUseCase
 * - Only DRAFT posts can be published
 *
 * Error Mapping:
 * - 401: Unauthorized (not authenticated)
 * - 404: POST_NOT_FOUND
 * - 409: POST_ALREADY_PUBLISHED, CANNOT_PUBLISH_ARCHIVED_POST
 * - 500: INTERNAL_SERVER_ERROR
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const postId = params.id;

    // Instantiate use case with repository
    const useCase = new PublishPostUseCase(new PostRepositoryPrisma());
    const dto = await useCase.execute(postId);

    return NextResponse.json({ success: true, data: dto });
  } catch (error) {
    // Use case errors
    if (error instanceof Error) {
      if (error.message === PostError.POST_NOT_FOUND) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 404 }
        );
      }
      if (error.message === PostError.POST_ALREADY_PUBLISHED) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 409 }
        );
      }
      if (error.message === PostError.CANNOT_PUBLISH_ARCHIVED_POST) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 409 }
        );
      }
    }

    // Internal server error
    console.error("POST /api/posts/[id]/publish error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
