/**
 * Get Members Use Case
 *
 * Fetches members with pagination, filtering, and sorting.
 *
 * Architecture: Application Layer
 * Purpose: Use case orchestration - NO business logic
 */

import { IDashboardRepository } from '@/application/ports/dashboard-repository.interface';
import { MemberDTO } from '@/application/dto/dashboard.dto';

/**
 * Input for GetMembers use case
 */
export interface GetMembersInput {
  communityId: string;
  page?: number;
  limit?: number;
  plan?: 'free' | 'starter' | 'growth' | 'enterprise';
  sortBy?: 'name' | 'joinedAt' | 'lastActiveAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Output for GetMembers use case
 */
export interface GetMembersOutput {
  members: MemberDTO[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Error enum for GetMembers use case
 */
export enum GetMembersError {
  COMMUNITY_ID_REQUIRED = 'COMMUNITY_ID_REQUIRED',
  INVALID_PAGE = 'INVALID_PAGE',
  INVALID_LIMIT = 'INVALID_LIMIT',
  REPOSITORY_ERROR = 'REPOSITORY_ERROR',
}

/**
 * Get Members Use Case
 */
export class GetMembersUseCase {
  constructor(private readonly dashboardRepository: IDashboardRepository) {}

  async execute(input: GetMembersInput): Promise<GetMembersOutput> {
    try {
      // Validate input
      if (!input.communityId) {
        throw new Error(GetMembersError.COMMUNITY_ID_REQUIRED);
      }

      const page = input.page || 1;
      const limit = input.limit || 20;

      if (page < 1) {
        throw new Error(GetMembersError.INVALID_PAGE);
      }

      if (limit < 1 || limit > 100) {
        throw new Error(GetMembersError.INVALID_LIMIT);
      }

      // Fetch members from repository
      const result = await this.dashboardRepository.getMembers(input.communityId, {
        page,
        limit,
        plan: input.plan,
        sortBy: input.sortBy,
        sortOrder: input.sortOrder,
      });

      return {
        members: result.members,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        if (Object.values(GetMembersError).includes(error.message as any)) {
          throw error;
        }
      }
      throw new Error(GetMembersError.REPOSITORY_ERROR);
    }
  }
}
