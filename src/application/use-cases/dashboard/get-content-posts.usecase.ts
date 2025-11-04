/**
 * Get Content Posts Use Case
 *
 * Fetches content posts with filtering for dashboard display.
 *
 * Architecture: Application Layer
 * Purpose: Use case orchestration - NO business logic
 */

import { IDashboardRepository } from '@/application/ports/dashboard-repository.interface';
import { ContentPostDTO } from '@/application/dto/dashboard.dto';

/**
 * Input for GetContentPosts use case
 */
export interface GetContentPostsInput {
  communityId: string;
  spaceId?: string;
  status?: 'published' | 'draft';
  limit?: number;
}

/**
 * Error enum for GetContentPosts use case
 */
export enum GetContentPostsError {
  COMMUNITY_ID_REQUIRED = 'COMMUNITY_ID_REQUIRED',
  INVALID_LIMIT = 'INVALID_LIMIT',
  REPOSITORY_ERROR = 'REPOSITORY_ERROR',
}

/**
 * Get Content Posts Use Case
 */
export class GetContentPostsUseCase {
  constructor(private readonly dashboardRepository: IDashboardRepository) {}

  async execute(input: GetContentPostsInput): Promise<ContentPostDTO[]> {
    try {
      // Validate input
      if (!input.communityId) {
        throw new Error(GetContentPostsError.COMMUNITY_ID_REQUIRED);
      }

      const limit = input.limit || 20;
      if (limit < 1 || limit > 100) {
        throw new Error(GetContentPostsError.INVALID_LIMIT);
      }

      // Fetch posts from repository
      const posts = await this.dashboardRepository.getContentPosts(input.communityId, {
        spaceId: input.spaceId,
        status: input.status,
        limit,
      });

      return posts;
    } catch (error) {
      if (error instanceof Error) {
        if (Object.values(GetContentPostsError).includes(error.message as any)) {
          throw error;
        }
      }
      throw new Error(GetContentPostsError.REPOSITORY_ERROR);
    }
  }
}
