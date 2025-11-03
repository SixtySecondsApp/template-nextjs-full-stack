import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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
 * - 400: INVALID_POST_ID
 * - 401: Unauthorized (not authenticated)
 * - 404: POST_NOT_FOUND
 * - 409: POST_ALREADY_PUBLISHED, POST_ALREADY_ARCHIVED
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

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new PublishPostUseCase(new PostRepositoryPrisma());
    // const dto = await useCase.execute(postId);

    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      message: "Publish post API route ready - waiting for application layer",
      data: {
        id: postId,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    // FINAL IMPLEMENTATION (uncomment when use cases ready):
    // return NextResponse.json({ success: true, data: dto });
  } catch (error) {
    // Use case errors (uncomment when use cases ready)
    // if (error instanceof Error) {
    //   if (error.message === PostError.INVALID_POST_ID) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 400 }
    //     );
    //   }
    //   if (error.message === PostError.POST_NOT_FOUND) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 404 }
    //     );
    //   }
    //   if (error.message === PostError.POST_ALREADY_PUBLISHED) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 409 }
    //     );
    //   }
    //   if (error.message === PostError.POST_ALREADY_ARCHIVED) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 409 }
    //     );
    //   }
    // }

    // Internal server error
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
