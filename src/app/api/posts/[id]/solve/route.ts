import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * API Route: POST /api/posts/[id]/solve
 * Mark a post as solved (for Q&A/support posts).
 *
 * Architecture:
 * - Thin controller layer
 * - Delegates to MarkSolvedUseCase
 * - Sets isSolved flag to true
 *
 * Error Mapping:
 * - 400: INVALID_POST_ID
 * - 401: Unauthorized (not authenticated)
 * - 404: POST_NOT_FOUND
 * - 409: POST_ALREADY_SOLVED, POST_ALREADY_ARCHIVED, CANNOT_MODIFY_ARCHIVED_POST
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
    // const useCase = new MarkSolvedUseCase(new PostRepositoryPrisma());
    // const dto = await useCase.execute(postId);

    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      message:
        "Mark solved post API route ready - waiting for application layer",
      data: {
        id: postId,
        isSolved: true,
        solvedAt: new Date(),
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
    //   if (error.message === PostError.POST_ALREADY_SOLVED) {
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
    //   if (error.message === PostError.CANNOT_MODIFY_ARCHIVED_POST) {
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
