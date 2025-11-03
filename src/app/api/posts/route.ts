import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CreatePostSchema } from "@/lib/validations/post.schema";

/**
 * API Route: POST /api/posts
 * Create a new post (in DRAFT status by default).
 *
 * Architecture:
 * - Thin controller layer - validation and orchestration only
 * - Delegates business logic to CreatePostUseCase
 * - Uses Clerk for authentication
 * - Returns DTO as JSON response
 *
 * Error Mapping:
 * - 400: Validation errors (Zod), INVALID_INPUT, INVALID_TITLE, INVALID_CONTENT
 * - 401: Unauthorized (not authenticated)
 * - 404: COMMUNITY_NOT_FOUND, AUTHOR_NOT_FOUND
 * - 409: POST_ALREADY_EXISTS (if duplicate detection is implemented)
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
    const validatedData = CreatePostSchema.parse(body);

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new CreatePostUseCase(
    //   new PostRepositoryPrisma(),
    //   eventBus.publish.bind(eventBus)
    // );
    // const dto = await useCase.execute(validatedData);

    // TEMPORARY: Return mock response until use case is implemented
    return NextResponse.json(
      {
        success: true,
        message: "Post API route ready - waiting for application layer",
        data: {
          id: "mock-id",
          ...validatedData,
          status: "DRAFT",
          isPinned: false,
          isSolved: false,
          viewCount: 0,
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
    //   if (error.message === PostError.COMMUNITY_NOT_FOUND) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 404 }
    //     );
    //   }
    //   if (error.message === PostError.AUTHOR_NOT_FOUND) {
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
 * API Route: GET /api/posts?communityId=xxx
 * List posts by community (non-archived, PUBLISHED posts only by default).
 *
 * Architecture:
 * - Thin controller layer
 * - Delegates to ListPostsUseCase
 * - Enforces soft delete filter in repository
 *
 * Error Mapping:
 * - 400: Missing communityId parameter
 * - 401: Unauthorized (not authenticated)
 * - 404: COMMUNITY_NOT_FOUND
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
    const communityId = searchParams.get("communityId");

    if (!communityId) {
      return NextResponse.json(
        { success: false, message: "communityId query parameter is required" },
        { status: 400 }
      );
    }

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new ListPostsUseCase(new PostRepositoryPrisma());
    // const dtos = await useCase.execute(communityId);

    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      message: "Post list API route ready - waiting for application layer",
      data: [],
    });

    // FINAL IMPLEMENTATION (uncomment when use cases ready):
    // return NextResponse.json({ success: true, data: dtos });
  } catch (error) {
    // Use case errors (uncomment when use cases ready)
    // if (error instanceof Error) {
    //   if (error.message === PostError.COMMUNITY_NOT_FOUND) {
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
