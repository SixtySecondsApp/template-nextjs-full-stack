import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GetContentPostsUseCase, GetContentPostsError } from '@/application/use-cases/dashboard/get-content-posts.usecase';
import { DashboardRepositoryPrisma } from '@/infrastructure/repositories/dashboard.repository.prisma';

/**
 * API Route: GET /api/content/posts
 * Get content posts with filtering for dashboard display.
 *
 * Architecture:
 * - Thin controller - validation and orchestration only
 * - Delegates to GetContentPostsUseCase
 * - Uses Clerk for authentication
 * - Returns DTO array as JSON response
 *
 * Query Parameters:
 * - communityId: string (required)
 * - spaceId: string (optional)
 * - status: 'published' | 'draft' (optional)
 * - limit: number (optional, default: 20, max: 100)
 *
 * Error Mapping:
 * - 400: Validation errors, INVALID_LIMIT
 * - 401: Unauthorized
 * - 404: COMMUNITY_ID_REQUIRED
 * - 500: REPOSITORY_ERROR
 */

const QuerySchema = z.object({
  communityId: z.string().min(1),
  spaceId: z.string().optional(),
  status: z.enum(['published', 'draft']).optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      communityId: searchParams.get('communityId') || '',
      spaceId: searchParams.get('spaceId'),
      status: searchParams.get('status'),
      limit: searchParams.get('limit'),
    };

    const validatedParams = QuerySchema.parse(queryParams);

    // Instantiate use case with repository
    const useCase = new GetContentPostsUseCase(new DashboardRepositoryPrisma());

    // Execute use case
    const posts = await useCase.execute({
      communityId: validatedParams.communityId,
      spaceId: validatedParams.spaceId,
      status: validatedParams.status,
      limit: validatedParams.limit,
    });

    // Return success response
    return NextResponse.json(
      { success: true, data: posts },
      { status: 200 }
    );
  } catch (error) {
    // Validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    // Use case errors
    if (error instanceof Error) {
      if (error.message === GetContentPostsError.COMMUNITY_ID_REQUIRED) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 400 }
        );
      }
      if (error.message === GetContentPostsError.INVALID_LIMIT) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 400 }
        );
      }
    }

    // Generic error
    console.error('Error fetching content posts:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
