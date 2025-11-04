import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SaveDraftUseCase } from "@/application/use-cases/posts/save-draft.usecase";
import { PostDraftRepositoryPrisma } from "@/infrastructure/repositories/post-draft-repository.prisma";
import { DraftError } from "@/application/errors/post.errors";
import prisma from "@/lib/prisma";

// Zod validation schema
const SaveDraftSchema = z.object({
  postId: z.string().optional().nullable(),
  content: z.record(z.unknown()).refine(
    (data) => typeof data === "object" && !Array.isArray(data),
    { message: "Content must be a valid JSON object" }
  ),
});

/**
 * POST /api/posts/draft
 * Save post draft with autosave (5-second debounce)
 *
 * @auth Required - Clerk authentication
 * @body { postId?: string, content: Record<string, unknown> }
 * @returns 200 - PostDraftDTO
 * @throws 400 - Validation error
 * @throws 401 - Unauthorized
 * @throws 500 - Internal server error
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Clerk Authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const validatedData = SaveDraftSchema.parse(body);

    // 3. Execute use case
    const draftRepository = new PostDraftRepositoryPrisma(prisma);
    const saveDraftUseCase = new SaveDraftUseCase(draftRepository);

    const draftDTO = await saveDraftUseCase.execute({
      userId,
      postId: validatedData.postId ?? undefined,
      content: validatedData.content,
    });

    // 4. Return success response
    return NextResponse.json(
      {
        success: true,
        data: draftDTO,
        message: "Draft saved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    // Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    // Use case errors
    if (error instanceof Error) {
      const errorMessage = error.message;

      // Map error enums to HTTP status codes
      switch (errorMessage) {
        case DraftError.INVALID_CONTENT:
          return NextResponse.json(
            { success: false, message: "Invalid draft content" },
            { status: 400 }
          );

        case DraftError.POST_NOT_FOUND:
          return NextResponse.json(
            { success: false, message: "Post not found" },
            { status: 404 }
          );

        case DraftError.EXPIRED_DRAFT:
          return NextResponse.json(
            { success: false, message: "Draft has expired" },
            { status: 410 }
          );

        case DraftError.SAVE_FAILED:
          return NextResponse.json(
            { success: false, message: "Failed to save draft" },
            { status: 500 }
          );

        default:
          console.error("[POST /api/posts/draft] Error:", error);
          return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 }
          );
      }
    }

    // Unknown errors
    console.error("[POST /api/posts/draft] Unknown error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
