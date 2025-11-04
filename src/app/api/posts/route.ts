import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CreatePostSchema } from "@/lib/validations/post.schema";
import { CreatePostUseCase } from "@/application/use-cases/posts/create-post.usecase";
import { ListPostsUseCase } from "@/application/use-cases/posts/list-posts.usecase";
import { PostRepositoryPrisma } from "@/infrastructure/repositories";
import { PostError } from "@/application/errors/post.errors";

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

    // Instantiate use case with repository
    const useCase = new CreatePostUseCase(new PostRepositoryPrisma());
    const dto = await useCase.execute({
      communityId: validatedData.communityId,
      authorId: userId, // Use authenticated userId
      title: validatedData.title,
      content: validatedData.content,
    });

    return NextResponse.json(
      { success: true, data: dto },
      { status: 201 }
    );
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

    // Use case errors
    if (error instanceof Error) {
      if (error.message === PostError.INVALID_TITLE) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 400 }
        );
      }
      if (error.message === PostError.INVALID_CONTENT) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 400 }
        );
      }
      if (error.message === PostError.COMMUNITY_NOT_FOUND) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 404 }
        );
      }
      if (error.message === PostError.AUTHOR_NOT_FOUND) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 404 }
        );
      }
    }

    // Internal server error
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * API Route: GET /api/posts?communityId=xxx
 * List posts by community (non-archived posts only by default).
 *
 * Architecture:
 * - Thin controller layer
 * - Delegates to ListPostsUseCase
 * - Enforces soft delete filter in repository
 * - Authentication is optional for public communities
 *
 * Error Mapping:
 * - 400: Missing communityId parameter
 * - 404: COMMUNITY_NOT_FOUND
 * - 500: INTERNAL_SERVER_ERROR
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const communityId = searchParams.get("communityId");

    if (!communityId) {
      return NextResponse.json(
        { success: false, message: "communityId query parameter is required" },
        { status: 400 }
      );
    }

    // Instantiate use case with repository
    const useCase = new ListPostsUseCase(new PostRepositoryPrisma());
    const dtos = await useCase.execute(communityId);

    return NextResponse.json({ success: true, data: dtos });
  } catch (error) {
    // Use case errors
    if (error instanceof Error) {
      if (error.message === PostError.COMMUNITY_NOT_FOUND) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 404 }
        );
      }
      if (error.message === PostError.INVALID_INPUT) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 400 }
        );
      }
    }

    // Internal server error
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
