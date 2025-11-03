import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UpdateCommentSchema } from "@/lib/validations/comment.schema";

/**
 * API Route: GET /api/comments/[id]
 * Get a comment by ID.
 *
 * Architecture:
 * - Thin controller layer
 * - Delegates to GetCommentUseCase
 * - Enforces soft delete filter in repository
 * - Returns comment with threading information
 *
 * Error Mapping:
 * - 400: INVALID_COMMENT_ID
 * - 401: Unauthorized (not authenticated)
 * - 404: COMMENT_NOT_FOUND
 * - 500: INTERNAL_SERVER_ERROR
 */
export async function GET(
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

    const commentId = params.id;

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new GetCommentUseCase(new CommentRepositoryPrisma());
    // const dto = await useCase.execute(commentId);

    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      message: "Get comment API route ready - waiting for application layer",
      data: {
        id: commentId,
        postId: "mock-post-id",
        authorId: "mock-author-id",
        parentId: null,
        content: "This is mock comment content",
        depth: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // FINAL IMPLEMENTATION (uncomment when use cases ready):
    // return NextResponse.json({ success: true, data: dto });
  } catch (error) {
    // Use case errors (uncomment when use cases ready)
    // if (error instanceof Error) {
    //   if (error.message === CommentError.INVALID_COMMENT_ID) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 400 }
    //     );
    //   }
    //   if (error.message === CommentError.COMMENT_NOT_FOUND) {
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

/**
 * API Route: PATCH /api/comments/[id]
 * Update a comment's content.
 *
 * Architecture:
 * - Thin controller layer - validation and orchestration only
 * - Delegates business logic to UpdateCommentUseCase
 * - Only content can be updated
 *
 * Error Mapping:
 * - 400: Validation errors (Zod), INVALID_CONTENT
 * - 401: Unauthorized (not authenticated)
 * - 404: COMMENT_NOT_FOUND
 * - 409: COMMENT_ALREADY_ARCHIVED, CANNOT_MODIFY_ARCHIVED_COMMENT
 * - 500: INTERNAL_SERVER_ERROR
 */
export async function PATCH(
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

    const commentId = params.id;

    // Validate request body
    const body = await request.json();
    const validatedData = UpdateCommentSchema.parse(body);

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new UpdateCommentUseCase(new CommentRepositoryPrisma());
    // const dto = await useCase.execute(commentId, validatedData);

    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      message: "Update comment API route ready - waiting for application layer",
      data: {
        id: commentId,
        content: validatedData.content,
        updatedAt: new Date(),
      },
    });

    // FINAL IMPLEMENTATION (uncomment when use cases ready):
    // return NextResponse.json({ success: true, data: dto });
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
    //   if (error.message === CommentError.COMMENT_NOT_FOUND) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 404 }
    //     );
    //   }
    //   if (error.message === CommentError.COMMENT_ALREADY_ARCHIVED) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 409 }
    //     );
    //   }
    //   if (error.message === CommentError.CANNOT_MODIFY_ARCHIVED_COMMENT) {
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
 * API Route: DELETE /api/comments/[id]
 * Archive a comment (soft delete).
 *
 * Architecture:
 * - Thin controller layer
 * - Delegates to ArchiveCommentUseCase
 * - Sets deletedAt timestamp (soft delete pattern)
 *
 * Error Mapping:
 * - 400: INVALID_COMMENT_ID
 * - 401: Unauthorized (not authenticated)
 * - 404: COMMENT_NOT_FOUND
 * - 409: COMMENT_ALREADY_ARCHIVED
 * - 500: INTERNAL_SERVER_ERROR
 */
export async function DELETE(
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

    const commentId = params.id;

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new ArchiveCommentUseCase(new CommentRepositoryPrisma());
    // await useCase.execute(commentId);

    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      message:
        "Archive comment API route ready - waiting for application layer",
    });

    // FINAL IMPLEMENTATION (uncomment when use cases ready):
    // return NextResponse.json({ success: true, message: "Comment archived successfully" });
  } catch (error) {
    // Use case errors (uncomment when use cases ready)
    // if (error instanceof Error) {
    //   if (error.message === CommentError.INVALID_COMMENT_ID) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 400 }
    //     );
    //   }
    //   if (error.message === CommentError.COMMENT_NOT_FOUND) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 404 }
    //     );
    //   }
    //   if (error.message === CommentError.COMMENT_ALREADY_ARCHIVED) {
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
