import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UpdatePostSchema } from "@/lib/validations/post.schema";

/**
 * API Route: GET /api/posts/[id]
 * Get a post by ID and increment view count.
 *
 * Architecture:
 * - Thin controller layer
 * - Delegates to GetPostUseCase which also increments view count
 * - Enforces soft delete filter in repository
 *
 * Error Mapping:
 * - 400: INVALID_POST_ID
 * - 401: Unauthorized (not authenticated)
 * - 404: POST_NOT_FOUND
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

    const postId = params.id;

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new GetPostUseCase(new PostRepositoryPrisma());
    // const dto = await useCase.execute(postId); // also increments view count

    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      message: "Get post API route ready - waiting for application layer",
      data: {
        id: postId,
        communityId: "mock-community-id",
        authorId: "mock-author-id",
        title: "Mock Post",
        content: "This is mock content",
        status: "PUBLISHED",
        isPinned: false,
        isSolved: false,
        viewCount: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
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
    // }

    // Internal server error
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * API Route: PATCH /api/posts/[id]
 * Update a post's title and/or content.
 *
 * Architecture:
 * - Thin controller layer - validation and orchestration only
 * - Delegates business logic to UpdatePostUseCase
 * - Only DRAFT posts can be fully updated, PUBLISHED posts have restrictions
 *
 * Error Mapping:
 * - 400: Validation errors (Zod), INVALID_TITLE, INVALID_CONTENT
 * - 401: Unauthorized (not authenticated)
 * - 404: POST_NOT_FOUND
 * - 409: POST_ALREADY_ARCHIVED, CANNOT_MODIFY_ARCHIVED_POST
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

    const postId = params.id;

    // Validate request body
    const body = await request.json();
    const validatedData = UpdatePostSchema.parse(body);

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new UpdatePostUseCase(new PostRepositoryPrisma());
    // const dto = await useCase.execute(postId, validatedData);

    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      message: "Update post API route ready - waiting for application layer",
      data: {
        id: postId,
        ...validatedData,
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
    //   if (error.message === PostError.INVALID_TITLE) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 400 }
    //     );
    //   }
    //   if (error.message === PostError.INVALID_CONTENT) {
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

/**
 * API Route: DELETE /api/posts/[id]
 * Archive a post (soft delete).
 *
 * Architecture:
 * - Thin controller layer
 * - Delegates to ArchivePostUseCase
 * - Sets deletedAt timestamp (soft delete pattern)
 *
 * Error Mapping:
 * - 400: INVALID_POST_ID
 * - 401: Unauthorized (not authenticated)
 * - 404: POST_NOT_FOUND
 * - 409: POST_ALREADY_ARCHIVED
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

    const postId = params.id;

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new ArchivePostUseCase(new PostRepositoryPrisma());
    // await useCase.execute(postId);

    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      message: "Archive post API route ready - waiting for application layer",
    });

    // FINAL IMPLEMENTATION (uncomment when use cases ready):
    // return NextResponse.json({ success: true, message: "Post archived successfully" });
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
