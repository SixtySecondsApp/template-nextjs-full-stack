import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { MemberPlanSchema } from '@/application/dto/dashboard.schema';
import { GetMembersUseCase, GetMembersError } from '@/application/use-cases/dashboard/get-members.usecase';
import { DashboardRepositoryPrisma } from '@/infrastructure/repositories/dashboard.repository.prisma';

/**
 * API Route: GET /api/members
 * Get members with pagination, filtering, and sorting.
 *
 * Architecture:
 * - Thin controller - validation and orchestration only
 * - Delegates to GetMembersUseCase
 * - Uses Clerk for authentication
 * - Returns paginated DTO array as JSON response
 *
 * Query Parameters:
 * - communityId: string (required)
 * - page: number (optional, default: 1)
 * - limit: number (optional, default: 20, max: 100)
 * - plan: 'free' | 'starter' | 'growth' | 'enterprise' (optional)
 * - sortBy: 'name' | 'joinedAt' | 'lastActiveAt' (optional, default: 'joinedAt')
 * - sortOrder: 'asc' | 'desc' (optional, default: 'desc')
 *
 * Error Mapping:
 * - 400: Validation errors, INVALID_PAGE, INVALID_LIMIT
 * - 401: Unauthorized
 * - 404: COMMUNITY_ID_REQUIRED
 * - 500: REPOSITORY_ERROR
 */

const QuerySchema = z.object({
  communityId: z.string().min(1),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  plan: MemberPlanSchema.optional(),
  sortBy: z.enum(['name', 'joinedAt', 'lastActiveAt']).optional().default('joinedAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
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
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      plan: searchParams.get('plan'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder'),
    };

    const validatedParams = QuerySchema.parse(queryParams);

    // Instantiate use case with repository
    const useCase = new GetMembersUseCase(new DashboardRepositoryPrisma());

    // Execute use case
    const result = await useCase.execute({
      communityId: validatedParams.communityId,
      page: validatedParams.page,
      limit: validatedParams.limit,
      plan: validatedParams.plan,
      sortBy: validatedParams.sortBy,
      sortOrder: validatedParams.sortOrder,
    });

    // Return success response
    return NextResponse.json(
      { success: true, data: result.members, pagination: result.pagination },
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
      if (error.message === GetMembersError.COMMUNITY_ID_REQUIRED) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 400 }
        );
      }
      if (error.message === GetMembersError.INVALID_PAGE) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 400 }
        );
      }
      if (error.message === GetMembersError.INVALID_LIMIT) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 400 }
        );
      }
    }

    // Generic error
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
