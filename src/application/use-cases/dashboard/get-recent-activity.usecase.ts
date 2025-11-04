/**
 * Get Recent Activity Use Case
 *
 * Fetches recent activity items for the dashboard.
 *
 * Architecture: Application Layer
 * Purpose: Use case orchestration - NO business logic
 */

import { IDashboardRepository } from '@/application/ports/dashboard-repository.interface';
import { ActivityItemDTO } from '@/application/dto/dashboard.dto';

/**
 * Input for GetRecentActivity use case
 */
export interface GetRecentActivityInput {
  communityId: string;
  limit?: number;
}

/**
 * Error enum for GetRecentActivity use case
 */
export enum GetRecentActivityError {
  COMMUNITY_ID_REQUIRED = 'COMMUNITY_ID_REQUIRED',
  INVALID_LIMIT = 'INVALID_LIMIT',
  REPOSITORY_ERROR = 'REPOSITORY_ERROR',
}

/**
 * Get Recent Activity Use Case
 */
export class GetRecentActivityUseCase {
  constructor(private readonly dashboardRepository: IDashboardRepository) {}

  async execute(input: GetRecentActivityInput): Promise<ActivityItemDTO[]> {
    try {
      // Validate input
      if (!input.communityId) {
        throw new Error(GetRecentActivityError.COMMUNITY_ID_REQUIRED);
      }

      const limit = input.limit || 10;
      if (limit < 1 || limit > 100) {
        throw new Error(GetRecentActivityError.INVALID_LIMIT);
      }

      // Fetch activity from repository
      const activities = await this.dashboardRepository.getRecentActivity(
        input.communityId,
        limit
      );

      // Convert to DTOs (activities are already in DTO format from repository)
      return activities.map((activity) => ({
        ...activity,
        timestamp: activity.timestamp.toISOString(),
      }));
    } catch (error) {
      if (error instanceof Error) {
        if (Object.values(GetRecentActivityError).includes(error.message as any)) {
          throw error;
        }
      }
      throw new Error(GetRecentActivityError.REPOSITORY_ERROR);
    }
  }
}
