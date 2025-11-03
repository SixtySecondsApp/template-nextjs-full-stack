import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UpdateCommunitySchema } from "@/lib/validations/community.schema";

/**
 * API Route: GET /api/communities/[id]
 * Get a community by ID.
 *
 * Architecture:
 * - Thin controller layer
 * - Delegates to GetCommunityUseCase
 * - Returns DTO as JSON response
 *
 * Error Mapping:
 * - 400: COMMUNITY_ID_REQUIRED
 * - 401: Unauthorized (not authenticated)
 * - 404: COMMUNITY_NOT_FOUND
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
        { success: false, message: "COMMUNITY_ID_REQUIRED" },
        { status: 400 }
      );
    }

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new GetCommunityUseCase(new CommunityRepositoryPrisma());
    // const dto = await useCase.execute(id);

    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      message:
        "Get community API route ready - waiting for application layer",
      data: {
        id,
        name: "Mock Community",
        logoUrl: null,
        primaryColor: "#0066CC",
        ownerId: "mock-owner-id",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // FINAL IMPLEMENTATION (uncomment when use cases ready):
    // return NextResponse.json({ success: true, data: dto });
  } catch (error) {
    // Use case errors (uncomment when use cases ready)
    // if (error instanceof Error) {
    //   if (error.message === GetCommunityUseCaseError.COMMUNITY_NOT_FOUND) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 404 }
    //     );
    //   }
    //   if (error.message === GetCommunityUseCaseError.COMMUNITY_ID_REQUIRED) {
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
 * API Route: PATCH /api/communities/[id]
 * Update a community's branding.
 *
 * Architecture:
 * - Thin controller layer
 * - Validates input with Zod
 * - Delegates to UpdateCommunityUseCase
 * - Returns updated DTO
 *
 * Error Mapping:
 * - 400: Validation errors, COMMUNITY_ID_REQUIRED, INVALID_INPUT
 * - 401: Unauthorized
 * - 404: COMMUNITY_NOT_FOUND
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
        { success: false, message: "COMMUNITY_ID_REQUIRED" },
        { status: 400 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validatedData = UpdateCommunitySchema.parse(body);

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new UpdateCommunityUseCase(
    //   new CommunityRepositoryPrisma(),
    //   eventBus.publish.bind(eventBus)
    // );
    // const dto = await useCase.execute({ id, ...validatedData });

    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      message:
        "Update community API route ready - waiting for application layer",
      data: {
        id,
        ...validatedData,
        name: validatedData.name ?? "Mock Community",
        primaryColor: validatedData.primaryColor ?? "#0066CC",
        ownerId: "mock-owner-id",
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
    //   if (error.message === UpdateCommunityUseCaseError.COMMUNITY_NOT_FOUND) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 404 }
    //     );
    //   }
    //   if (
    //     error.message === UpdateCommunityUseCaseError.INVALID_INPUT ||
    //     error.message === UpdateCommunityUseCaseError.COMMUNITY_ID_REQUIRED
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
 * API Route: DELETE /api/communities/[id]
 * Archive (soft delete) a community.
 *
 * Architecture:
 * - Thin controller layer
 * - Delegates to ArchiveCommunityUseCase
 * - Soft delete pattern (sets deletedAt timestamp)
 *
 * Error Mapping:
 * - 400: COMMUNITY_ID_REQUIRED
 * - 401: Unauthorized
 * - 404: COMMUNITY_NOT_FOUND
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
        { success: false, message: "COMMUNITY_ID_REQUIRED" },
        { status: 400 }
      );
    }

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new ArchiveCommunityUseCase(
    //   new CommunityRepositoryPrisma(),
    //   eventBus.publish.bind(eventBus)
    // );
    // await useCase.execute(id);

    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      message:
        "Archive community API route ready - waiting for application layer",
    });

    // FINAL IMPLEMENTATION (uncomment when use cases ready):
    // return NextResponse.json({ success: true, message: "Community archived" });
  } catch (error) {
    // Use case errors (uncomment when use cases ready)
    // if (error instanceof Error) {
    //   if (error.message === ArchiveCommunityUseCaseError.COMMUNITY_NOT_FOUND) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 404 }
    //     );
    //   }
    //   if (error.message === ArchiveCommunityUseCaseError.COMMUNITY_ID_REQUIRED) {
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
