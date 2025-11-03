import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UpdateUserSchema } from "@/lib/validations/user.schema";

/**
 * API Route: GET /api/users/[id]
 * Get a user by ID.
 *
 * Architecture:
 * - Thin controller layer
 * - Delegates to GetUserUseCase
 * - Returns DTO as JSON response
 *
 * Error Mapping:
 * - 400: USER_ID_REQUIRED
 * - 401: Unauthorized (not authenticated)
 * - 404: USER_NOT_FOUND
 * - 500: INTERNAL_SERVER_ERROR
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
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

    // Extract and validate ID from params
    const { id } = await context.params;
    if (!id || id.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "USER_ID_REQUIRED" },
        { status: 400 }
      );
    }

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new GetUserUseCase(new UserRepositoryPrisma());
    // const dto = await useCase.execute(id);

    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      message: "Get user API route ready - waiting for application layer",
      data: {
        id,
        email: "mock@example.com",
        name: "Mock User",
        role: "MEMBER",
        communityId: "mock-community-id",
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // FINAL IMPLEMENTATION (uncomment when use cases ready):
    // return NextResponse.json({ success: true, data: dto });
  } catch (error) {
    // Use case errors (uncomment when use cases ready)
    // if (error instanceof Error) {
    //   if (error.message === GetUserUseCaseError.USER_NOT_FOUND) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 404 }
    //     );
    //   }
    //   if (error.message === GetUserUseCaseError.USER_ID_REQUIRED) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 400 }
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
 * API Route: PATCH /api/users/[id]
 * Update a user's profile.
 *
 * Architecture:
 * - Thin controller layer
 * - Validates input with Zod
 * - Delegates to UpdateUserUseCase
 * - Returns updated DTO
 *
 * Error Mapping:
 * - 400: Validation errors, USER_ID_REQUIRED, INVALID_INPUT
 * - 401: Unauthorized
 * - 404: USER_NOT_FOUND
 * - 500: INTERNAL_SERVER_ERROR
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
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

    // Extract and validate ID from params
    const { id } = await context.params;
    if (!id || id.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "USER_ID_REQUIRED" },
        { status: 400 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validatedData = UpdateUserSchema.parse(body);

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new UpdateUserUseCase(
    //   new UserRepositoryPrisma(),
    //   eventBus.publish.bind(eventBus)
    // );
    // const dto = await useCase.execute({ id, ...validatedData });

    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      message: "Update user API route ready - waiting for application layer",
      data: {
        id,
        ...validatedData,
        role: "MEMBER",
        communityId: "mock-community-id",
        createdAt: new Date(Date.now() - 86400000),
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
    //   if (error.message === UpdateUserUseCaseError.USER_NOT_FOUND) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 404 }
    //     );
    //   }
    //   if (
    //     error.message === UpdateUserUseCaseError.INVALID_INPUT ||
    //     error.message === UpdateUserUseCaseError.USER_ID_REQUIRED
    //   ) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 400 }
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
 * API Route: DELETE /api/users/[id]
 * Archive (soft delete) a user.
 *
 * Architecture:
 * - Thin controller layer
 * - Delegates to ArchiveUserUseCase
 * - Soft delete pattern (sets deletedAt timestamp)
 *
 * Error Mapping:
 * - 400: USER_ID_REQUIRED
 * - 401: Unauthorized
 * - 404: USER_NOT_FOUND
 * - 500: INTERNAL_SERVER_ERROR
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
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

    // Extract and validate ID from params
    const { id } = await context.params;
    if (!id || id.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "USER_ID_REQUIRED" },
        { status: 400 }
      );
    }

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new ArchiveUserUseCase(
    //   new UserRepositoryPrisma(),
    //   eventBus.publish.bind(eventBus)
    // );
    // await useCase.execute(id);

    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      message: "Archive user API route ready - waiting for application layer",
    });

    // FINAL IMPLEMENTATION (uncomment when use cases ready):
    // return NextResponse.json({ success: true, message: "User archived" });
  } catch (error) {
    // Use case errors (uncomment when use cases ready)
    // if (error instanceof Error) {
    //   if (error.message === ArchiveUserUseCaseError.USER_NOT_FOUND) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 404 }
    //     );
    //   }
    //   if (error.message === ArchiveUserUseCaseError.USER_ID_REQUIRED) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 400 }
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
