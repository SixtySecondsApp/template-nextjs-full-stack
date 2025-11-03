import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * API Route: POST /api/courses
 * Create a new course (in DRAFT status by default).
 *
 * Architecture:
 * - Thin controller layer - validation and orchestration only
 * - Delegates business logic to CreateCourseUseCase (TODO)
 * - Uses Clerk for authentication
 * - Returns DTO as JSON response
 */

const CreateCourseSchema = z.object({
  communityId: z.string().uuid(),
  instructorId: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000)
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = CreateCourseSchema.parse(body);

    // TODO: Instantiate use case when application layer is ready
    // TEMPORARY: Return mock response
    return NextResponse.json(
      {
        success: true,
        data: {
          id: `course-${Date.now()}`,
          ...validatedData,
          instructorName: "Instructor Name",
          isPublished: false,
          publishedAt: null,
          lessonCount: 0,
          enrolledCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.issues
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * API Route: GET /api/courses?communityId=xxx
 * List courses by community (published courses only by default).
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const communityId = searchParams.get("communityId");

    // TODO: Instantiate use case when application layer is ready
    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      data: []
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
