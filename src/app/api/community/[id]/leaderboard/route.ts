import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GetLeaderboardUseCase } from "@/application/use-cases/community/get-leaderboard.usecase";
import { UserRepositoryPrisma } from "@/infrastructure/repositories/user-repository.prisma";
import { PostRepositoryPrisma } from "@/infrastructure/repositories/post-repository.prisma";
import { CommentRepositoryPrisma } from "@/infrastructure/repositories/comment-repository.prisma";
import { LikeRepositoryPrisma } from "@/infrastructure/repositories/like-repository.prisma";
import { CommunityError } from "@/application/errors/community.errors";
import prisma from "@/lib/prisma";

/**
 * GET /api/community/[id]/leaderboard
 * Get top N contributors by points (post=5, comment=2, like=1)
 *
 * @auth Optional
 * @param id - Community ID
 * @query limit - Number of users to return (default: 5, max: 100)
 * @returns 200 - LeaderboardDTO[] with top contributors
 * @throws 400 - Invalid limit parameter
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

    // 2. Get limit from query params
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit") || "5";

    // Validate limit
    const limitSchema = z.coerce.number().int().min(1).max(100);
    const limit = limitSchema.parse(limitParam);

    // 3. Execute use case
    const userRepository = new UserRepositoryPrisma(prisma);
    const postRepository = new PostRepositoryPrisma(prisma);
    const commentRepository = new CommentRepositoryPrisma(prisma);
    const likeRepository = new LikeRepositoryPrisma(prisma);

    const getLeaderboardUseCase = new GetLeaderboardUseCase(
      userRepository,
      postRepository,
      commentRepository,
      likeRepository
    );

    const leaderboardDTO = await getLeaderboardUseCase.execute({
      communityId,
      limit,
    });

    // 4. Return success response
    return NextResponse.json(
      {
        success: true,
        data: leaderboardDTO,
      },
      { status: 200 }
    );
  } catch (error) {
    // Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid limit parameter",
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
        case CommunityError.NOT_FOUND:
          return NextResponse.json(
            { success: false, message: "Community not found" },
            { status: 404 }
          );

        default:
          console.error(
            "[GET /api/community/[id]/leaderboard] Error:",
            error
          );
          return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 }
          );
      }
    }

    // Unknown errors
    console.error(
      "[GET /api/community/[id]/leaderboard] Unknown error:",
      error
    );
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
