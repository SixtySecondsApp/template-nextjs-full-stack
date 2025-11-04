/**
 * Get Dashboard Metrics Use Case
 *
 * Orchestrates fetching dashboard metrics with time period comparison.
 * Calculates date ranges based on time filter and retrieves metrics.
 *
 * Architecture: Application Layer
 * Purpose: Use case orchestration - NO business logic
 */

import { IDashboardRepository } from '@/application/ports/dashboard-repository.interface';
import { DashboardMetricsDTO, TimeFilter } from '@/application/dto/dashboard.dto';
import { DashboardMetricsDtoMapper } from '@/application/mappers/dashboard-metrics-dto.mapper';

/**
 * Input for GetDashboardMetrics use case
 */
export interface GetDashboardMetricsInput {
  communityId: string;
  timeFilter: TimeFilter;
}

/**
 * Error enum for GetDashboardMetrics use case
 */
export enum GetDashboardMetricsError {
  COMMUNITY_ID_REQUIRED = 'COMMUNITY_ID_REQUIRED',
  INVALID_TIME_FILTER = 'INVALID_TIME_FILTER',
  REPOSITORY_ERROR = 'REPOSITORY_ERROR',
}

/**
 * Get Dashboard Metrics Use Case
 */
export class GetDashboardMetricsUseCase {
  constructor(private readonly dashboardRepository: IDashboardRepository) {}

  async execute(input: GetDashboardMetricsInput): Promise<DashboardMetricsDTO> {
    try {
      // Validate input
      if (!input.communityId) {
        throw new Error(GetDashboardMetricsError.COMMUNITY_ID_REQUIRED);
      }

      if (!['7d', '30d', '90d', '1y'].includes(input.timeFilter)) {
        throw new Error(GetDashboardMetricsError.INVALID_TIME_FILTER);
      }

      // Calculate date ranges based on time filter
      const { currentPeriodStart, currentPeriodEnd, previousPeriodStart, previousPeriodEnd } =
        this.calculateDateRanges(input.timeFilter);

      // Fetch metrics from repository
      const metrics = await this.dashboardRepository.getMetrics(
        currentPeriodStart,
        currentPeriodEnd,
        previousPeriodStart,
        previousPeriodEnd,
        input.communityId
      );

      // Convert to DTO
      return DashboardMetricsDtoMapper.toDto(metrics);
    } catch (error) {
      if (error instanceof Error) {
        if (Object.values(GetDashboardMetricsError).includes(error.message as any)) {
          throw error;
        }
      }
      throw new Error(GetDashboardMetricsError.REPOSITORY_ERROR);
    }
  }

  /**
   * Calculate date ranges for current and previous periods
   */
  private calculateDateRanges(timeFilter: TimeFilter): {
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    previousPeriodStart: Date;
    previousPeriodEnd: Date;
  } {
    const now = new Date();
    const currentPeriodEnd = now;
    let currentPeriodStart: Date;
    let previousPeriodStart: Date;
    let previousPeriodEnd: Date;

    switch (timeFilter) {
      case '7d':
        currentPeriodStart = new Date(now);
        currentPeriodStart.setDate(now.getDate() - 7);
        previousPeriodEnd = new Date(currentPeriodStart);
        previousPeriodStart = new Date(previousPeriodEnd);
        previousPeriodStart.setDate(previousPeriodEnd.getDate() - 7);
        break;

      case '30d':
        currentPeriodStart = new Date(now);
        currentPeriodStart.setDate(now.getDate() - 30);
        previousPeriodEnd = new Date(currentPeriodStart);
        previousPeriodStart = new Date(previousPeriodEnd);
        previousPeriodStart.setDate(previousPeriodEnd.getDate() - 30);
        break;

      case '90d':
        currentPeriodStart = new Date(now);
        currentPeriodStart.setDate(now.getDate() - 90);
        previousPeriodEnd = new Date(currentPeriodStart);
        previousPeriodStart = new Date(previousPeriodEnd);
        previousPeriodStart.setDate(previousPeriodEnd.getDate() - 90);
        break;

      case '1y':
        currentPeriodStart = new Date(now);
        currentPeriodStart.setFullYear(now.getFullYear() - 1);
        previousPeriodEnd = new Date(currentPeriodStart);
        previousPeriodStart = new Date(previousPeriodEnd);
        previousPeriodStart.setFullYear(previousPeriodEnd.getFullYear() - 1);
        break;

      default:
        throw new Error(GetDashboardMetricsError.INVALID_TIME_FILTER);
    }

    return {
      currentPeriodStart,
      currentPeriodEnd,
      previousPeriodStart,
      previousPeriodEnd,
    };
  }
}
