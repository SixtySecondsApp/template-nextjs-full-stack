import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UpdatePostSchema } from "@/lib/validations/post.schema";
import { GetPostUseCase } from "@/application/use-cases/posts/get-post.usecase";
import { UpdatePostUseCase } from "@/application/use-cases/posts/update-post.usecase";
import { ArchivePostUseCase } from "@/application/use-cases/posts/archive-post.usecase";
import { PostRepositoryPrisma } from "@/infrastructure/repositories";
import { PostError } from "@/application/errors/post.errors";

/**
 * API Route: GET /api/posts/[id]
 * Get a post by ID and increment view count.
 *
 * Architecture:
 * - Thin controller layer
 * - Delegates to GetPostUseCase which also increments view count
 * - Enforces soft delete filter in repository
 * - Authentication is optional for public posts
 *
 * Error Mapping:
 * - 400: INVALID_POST_ID, INVALID_INPUT
 * - 404: POST_NOT_FOUND
 * - 500: INTERNAL_SERVER_ERROR
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    // Instantiate use case with repository
    const useCase = new GetPostUseCase(new PostRepositoryPrisma());
    const dto = await useCase.execute(postId);

    return NextResponse.json({ success: true, data: dto });
  } catch (error) {
    // Use case errors
    if (error instanceof Error) {
      if (error.message === PostError.INVALID_INPUT) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 400 }
        );
      }
      if (error.message === PostError.POST_NOT_FOUND) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 404 }
        );
      }
    }

    // Internal server error
    console.error("GET /api/posts/[id] error:", error);
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

    // Instantiate use case with repository
    const useCase = new UpdatePostUseCase(new PostRepositoryPrisma());
    const dto = await useCase.execute({
      postId,
      title: validatedData.title,
      content: validatedData.content,
    });

    return NextResponse.json({ success: true, data: dto });
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
      if (error.message === PostError.POST_NOT_FOUND) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 404 }
        );
      }
      if (error.message === PostError.POST_ALREADY_ARCHIVED) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 409 }
        );
      }
      if (error.message === PostError.CANNOT_MODIFY_ARCHIVED_POST) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 409 }
        );
      }
    }

    // Internal server error
    console.error("PATCH /api/posts/[id] error:", error);
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
 * - 400: INVALID_POST_ID, INVALID_INPUT
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

    // Instantiate use case with repository
    const useCase = new ArchivePostUseCase(new PostRepositoryPrisma());
    await useCase.execute(postId);

    return NextResponse.json({
      success: true,
      message: "Post archived successfully"
    });
  } catch (error) {
    // Use case errors
    if (error instanceof Error) {
      if (error.message === PostError.INVALID_INPUT) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 400 }
        );
      }
      if (error.message === PostError.POST_NOT_FOUND) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 404 }
        );
      }
      if (error.message === PostError.POST_ALREADY_ARCHIVED) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 409 }
        );
      }
    }

    // Internal server error
    console.error("DELETE /api/posts/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
