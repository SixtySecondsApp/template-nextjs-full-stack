import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MentionSearchSchema } from "@/lib/validations/mention.schema";
import { prisma } from "@/lib/prisma";

/**
 * API Route: GET /api/mentions/search?q=username&communityId=xxx
 * Search community members by username prefix for @mention autocomplete.
 *
 * Architecture:
 * - Thin controller layer - validation and orchestration only
 * - Simplified implementation (no use case needed for autocomplete)
 * - Returns minimal user data for UI dropdown
 * - Limited to 10 results for performance
 *
 * Response Format:
 * ```json
 * {
 *   "success": true,
 *   "data": [
 *     { "id": "uuid", "name": "John Doe", "avatar": "url" }
 *   ]
 * }
 * ```
 *
 * Error Mapping:
 * - 400: Validation errors (Zod), query too short/long
 * - 401: Unauthorized (not authenticated)
 * - 404: Community not found
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

    // Extract and validate query parameters
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const communityId = searchParams.get("communityId");

    if (!q || !communityId) {
      return NextResponse.json(
        { success: false, message: "Missing query or communityId parameter" },
        { status: 400 }
      );
    }

    // Validate with Zod schema
    const validatedData = MentionSearchSchema.parse({ q, communityId });

    // Verify community exists
    const community = await prisma.community.findUnique({
      where: { id: validatedData.communityId, deletedAt: null },
    });

    if (!community) {
      return NextResponse.json(
        { success: false, message: "Community not found" },
        { status: 404 }
      );
    }

    // Search community members by name (case-insensitive prefix match)
    // Limited to 10 results for autocomplete dropdown
    const members = await prisma.communityMember.findMany({
      where: {
        communityId: validatedData.communityId,
        deletedAt: null, // Active members only
        user: {
          deletedAt: null, // Active users only
          OR: [
            {
              firstName: {
                startsWith: validatedData.q,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                startsWith: validatedData.q,
                mode: "insensitive",
              },
            },
          ],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      take: 10, // Limit to 10 results for performance
      orderBy: {
        user: {
          firstName: "asc", // Alphabetical order
        },
      },
    });

    // Map to minimal DTO for autocomplete
    const results = members.map((member) => ({
      id: member.user.id,
      name: `${member.user.firstName} ${member.user.lastName}`,
      avatar: member.user.avatarUrl || null,
    }));

    return NextResponse.json({ success: true, data: results });
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

    // Internal server error
    console.error("[Mention Search API Error]:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
