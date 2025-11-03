import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CreateUserSchema } from "@/lib/validations/user.schema";

/**
 * API Route: POST /api/users
 * Create a new user.
 *
 * Architecture:
 * - Thin controller layer - validation and orchestration only
 * - Delegates business logic to CreateUserUseCase
 * - Uses Clerk for authentication
 * - Returns DTO as JSON response
 *
 * Error Mapping:
 * - 400: Validation errors (Zod), INVALID_INPUT
 * - 401: Unauthorized (not authenticated)
 * - 409: EMAIL_ALREADY_EXISTS
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
    const validatedData = CreateUserSchema.parse(body);

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new CreateUserUseCase(
    //   new UserRepositoryPrisma(),
    //   eventBus.publish.bind(eventBus)
    // );
    // const dto = await useCase.execute(validatedData);

    // TEMPORARY: Return mock response until use case is implemented
    return NextResponse.json(
      {
        success: true,
        message: "User API route ready - waiting for application layer",
        data: {
          id: "mock-id",
          ...validatedData,
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
    //   if (error.message === CreateUserUseCaseError.EMAIL_ALREADY_EXISTS) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 409 }
    //     );
    //   }
    //   if (error.message === CreateUserUseCaseError.INVALID_INPUT) {
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
 * API Route: GET /api/users
 * List all users (non-archived only by default).
 *
 * Architecture:
 * - Thin controller layer
 * - Delegates to ListUsersUseCase
 * - Enforces soft delete filter in repository
 *
 * Error Mapping:
 * - 401: Unauthorized (not authenticated)
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

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new ListUsersUseCase(new UserRepositoryPrisma());
    // const dtos = await useCase.execute();

    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      message: "User list API route ready - waiting for application layer",
      data: [],
    });

    // FINAL IMPLEMENTATION (uncomment when use cases ready):
    // return NextResponse.json({ success: true, data: dtos });
  } catch (error) {
    // Use case errors (uncomment when use cases ready)
    // if (error instanceof Error) {
    //   // Map specific errors if needed
    // }

    // Internal server error
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
