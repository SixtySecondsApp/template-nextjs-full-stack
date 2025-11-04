import { NextRequest, NextResponse } from "next/server";
import { GetCommunityStatsUseCase } from "@/application/use-cases/community/get-community-stats.usecase";
import { UserRepositoryPrisma } from "@/infrastructure/repositories/user-repository.prisma";
import { CommunityError } from "@/application/errors/community.errors";
import prisma from "@/lib/prisma";

/**
 * GET /api/community/[id]/stats
 * Get real-time community statistics
 *
 * @auth Optional
 * @param id - Community ID
 * @returns 200 - CommunityStatsDTO { memberCount, onlineCount, adminCount }
 * @throws 404 - Community not found
 * @throws 500 - Internal server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Get community ID from params
    const { id: communityId } = params;

    // 2. Execute use case
    const userRepository = new UserRepositoryPrisma(prisma);
    const getCommunityStatsUseCase = new GetCommunityStatsUseCase(
      userRepository
    );

    const statsDTO = await getCommunityStatsUseCase.execute({
      communityId,
    });

    // 3. Return success response
    return NextResponse.json(
      {
        success: true,
        data: statsDTO,
      },
      { status: 200 }
    );
  } catch (error) {
    // Use case errors
    if (error instanceof Error) {
      const errorMessage = error.message;

      // Map error enums to HTTP status codes
      switch (errorMessage) {
        case CommunityError.NOT_FOUND:
          return NextResponse.json(
            { success: false, message: "Community not found" },
            { status: 404 }
          );

        default:
          console.error("[GET /api/community/[id]/stats] Error:", error);
          return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 }
          );
      }
    }

    // Unknown errors
    console.error("[GET /api/community/[id]/stats] Unknown error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
