/**
 * Dashboard Repository Interface (Port)
 *
 * Contract for dashboard data persistence operations.
 * Infrastructure layer implements this interface using Prisma.
 *
 * Architecture: Application Layer (Ports)
 * Purpose: Define boundary between Application and Infrastructure
 */

import { DashboardMetrics } from '@/domain/dashboard/dashboard-metrics.entity';
import { ActivityItem, Member, ContentPost, PendingTask } from '@/types/dashboard';

/**
 * Period statistics for metric calculations
 */
export interface PeriodStats {
  memberCount: number;
  postCount: number;
  commentCount: number;
  mrr: number; // Monthly recurring revenue in cents
}

/**
 * Dashboard repository contract
 */
export interface IDashboardRepository {
  /**
   * Get aggregated metrics for a time period
   *
   * @param currentPeriodStart - Start date of current period
   * @param currentPeriodEnd - End date of current period
   * @param previousPeriodStart - Start date of previous period for comparison
   * @param previousPeriodEnd - End date of previous period for comparison
   * @param communityId - Community identifier
   * @returns Dashboard metrics with comparison data
   */
  getMetrics(
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    previousPeriodStart: Date,
    previousPeriodEnd: Date,
    communityId: string
  ): Promise<DashboardMetrics>;

  /**
   * Get recent activity items
   *
   * @param communityId - Community identifier
   * @param limit - Maximum number of items to return
   * @returns Array of recent activity items
   */
  getRecentActivity(communityId: string, limit: number): Promise<ActivityItem[]>;

  /**
   * Get pending tasks that require admin attention
   *
   * @param communityId - Community identifier
   * @param limit - Maximum number of tasks to return
   * @returns Array of pending tasks
   */
  getPendingTasks(communityId: string, limit: number): Promise<PendingTask[]>;

  /**
   * Get members with pagination and filtering
   *
   * @param communityId - Community identifier
   * @param params - Query parameters for filtering and pagination
   * @returns Paginated array of members
   */
  getMembers(
    communityId: string,
    params: {
      page: number;
      limit: number;
      plan?: string;
      sortBy?: 'name' | 'joinedAt' | 'lastActiveAt';
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<{
    members: Member[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;

  /**
   * Get content posts with filtering
   *
   * @param communityId - Community identifier
   * @param params - Query parameters for filtering
   * @returns Array of content posts
   */
  getContentPosts(
    communityId: string,
    params: {
      spaceId?: string;
      status?: 'published' | 'draft';
      limit?: number;
    }
  ): Promise<ContentPost[]>;
}
