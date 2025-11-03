import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CreateCommentSchema } from "@/lib/validations/comment.schema";

/**
 * API Route: POST /api/comments
 * Create a new comment (supports threaded replies via parentId).
 *
 * Architecture:
 * - Thin controller layer - validation and orchestration only
 * - Delegates business logic to CreateCommentUseCase
 * - Uses Clerk for authentication
 * - Returns DTO as JSON response
 * - Supports threaded comments with maximum nesting depth enforcement
 *
 * Error Mapping:
 * - 400: Validation errors (Zod), INVALID_INPUT, INVALID_CONTENT, MAX_NESTING_DEPTH_EXCEEDED
 * - 401: Unauthorized (not authenticated)
 * - 404: POST_NOT_FOUND, PARENT_COMMENT_NOT_FOUND
 * - 409: CANNOT_COMMENT_ON_ARCHIVED_POST, POST_ALREADY_ARCHIVED
 * - 500: INTERNAL_SERVER_ERROR
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validatedData = CreateCommentSchema.parse(body);

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new CreateCommentUseCase(
    //   new CommentRepositoryPrisma(),
    //   new PostRepositoryPrisma(),
    //   eventBus.publish.bind(eventBus)
    // );
    // const dto = await useCase.execute(validatedData);

    // TEMPORARY: Return mock response until use case is implemented
    return NextResponse.json(
      {
        success: true,
        message: "Comment API route ready - waiting for application layer",
        data: {
          id: "mock-id",
          ...validatedData,
          depth: validatedData.parentId ? 1 : 0, // Mock depth calculation
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { status: 201 }
    );

    // FINAL IMPLEMENTATION (uncomment when use cases ready):
    // return NextResponse.json(
    //   { success: true, data: dto },
    //   { status: 201 }
    // );
  } catch (error) {
    // Validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    // Use case errors (uncomment when use cases ready)
    // if (error instanceof Error) {
    //   if (error.message === CommentError.INVALID_CONTENT) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 400 }
    //     );
    //   }
    //   if (error.message === CommentError.MAX_NESTING_DEPTH_EXCEEDED) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 400 }
    //     );
    //   }
    //   if (error.message === CommentError.POST_NOT_FOUND) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 404 }
    //     );
    //   }
    //   if (error.message === CommentError.PARENT_COMMENT_NOT_FOUND) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 404 }
    //     );
    //   }
    //   if (error.message === CommentError.CANNOT_COMMENT_ON_ARCHIVED_POST) {
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

/**
 * API Route: GET /api/comments?postId=xxx
 * List comments by post (with threaded structure, non-archived only).
 *
 * Architecture:
 * - Thin controller layer
 * - Delegates to ListCommentsUseCase
 * - Enforces soft delete filter in repository
 * - Returns comments with threading information (depth, parentId)
 *
 * Error Mapping:
 * - 400: Missing postId parameter
 * - 401: Unauthorized (not authenticated)
 * - 404: POST_NOT_FOUND
 * - 500: INTERNAL_SERVER_ERROR
 */
export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { success: false, message: "postId query parameter is required" },
        { status: 400 }
      );
    }

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new ListCommentsUseCase(new CommentRepositoryPrisma());
    // const dtos = await useCase.execute(postId);

    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      message: "Comment list API route ready - waiting for application layer",
      data: [],
    });

    // FINAL IMPLEMENTATION (uncomment when use cases ready):
    // return NextResponse.json({ success: true, data: dtos });
  } catch (error) {
    // Use case errors (uncomment when use cases ready)
    // if (error instanceof Error) {
    //   if (error.message === CommentError.POST_NOT_FOUND) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 404 }
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
