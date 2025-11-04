/**
 * Dashboard API Client
 *
 * Client-side API helpers for fetching dashboard data.
 * Uses TanStack Query for caching and state management.
 */

import type {
  DashboardMetricsDTO,
  ActivityItemDTO,
  PendingTaskDTO,
  QuickActionDTO,
  ResourceDTO,
  SetupProgressDTO,
  ActivityTrendsDTO,
  TimeFilter,
} from '@/application/dto/dashboard.dto';

/**
 * Fetch dashboard metrics
 */
export async function getDashboardMetrics(
  period: TimeFilter
): Promise<DashboardMetricsDTO> {
  const response = await fetch(`/api/dashboard/metrics?period=${period}`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard metrics');
  }
  const json = await response.json();
  return json.data;
}

/**
 * Fetch recent activity
 */
export async function getRecentActivity(
  limit: number = 10
): Promise<ActivityItemDTO[]> {
  const response = await fetch(`/api/dashboard/activity?limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch recent activity');
  }
  const json = await response.json();
  return json.data;
}

/**
 * Fetch pending tasks
 */
export async function getPendingTasks(): Promise<PendingTaskDTO[]> {
  const response = await fetch('/api/dashboard/tasks');
  if (!response.ok) {
    throw new Error('Failed to fetch pending tasks');
  }
  const json = await response.json();
  return json.data;
}

/**
 * Fetch quick actions
 */
export async function getQuickActions(): Promise<QuickActionDTO[]> {
  const response = await fetch('/api/dashboard/quick-actions');
  if (!response.ok) {
    throw new Error('Failed to fetch quick actions');
  }
  const json = await response.json();
  return json.data;
}

/**
 * Fetch recommended resources
 */
export async function getRecommendedResources(): Promise<ResourceDTO[]> {
  const response = await fetch('/api/dashboard/resources');
  if (!response.ok) {
    throw new Error('Failed to fetch recommended resources');
  }
  const json = await response.json();
  return json.data;
}

/**
 * Fetch setup progress
 */
export async function getSetupProgress(): Promise<SetupProgressDTO> {
  const response = await fetch('/api/dashboard/setup-progress');
  if (!response.ok) {
    throw new Error('Failed to fetch setup progress');
  }
  return response.json();
}

/**
 * Fetch activity trends data
 */
export async function getActivityTrends(
  period: TimeFilter
): Promise<ActivityTrendsDTO> {
  const response = await fetch(`/api/dashboard/trends?period=${period}`);
  if (!response.ok) {
    throw new Error('Failed to fetch activity trends');
  }
  const json = await response.json();
  return json.data;
}

/**
 * Dismiss setup progress banner
 */
export async function dismissSetupProgress(): Promise<void> {
  const response = await fetch('/api/dashboard/setup-progress/dismiss', {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to dismiss setup progress');
  }
}

/**
 * Update task status
 */
export async function updateTaskStatus(
  taskId: string,
  completed: boolean
): Promise<void> {
  const response = await fetch(`/api/dashboard/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ completed }),
  });
  if (!response.ok) {
    throw new Error('Failed to update task status');
  }
}
