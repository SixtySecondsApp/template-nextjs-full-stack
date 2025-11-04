/**
 * Dashboard TypeScript Interfaces
 *
 * Comprehensive type definitions for the Admin Dashboard.
 * These interfaces define the structure of all dashboard-related data.
 *
 * Architecture: Domain Layer
 * Purpose: Type safety and documentation for dashboard data structures
 */

/**
 * Metric change direction and type
 */
export type MetricChangeType = 'positive' | 'negative' | 'neutral';

/**
 * Time filter options for dashboard analytics
 */
export type TimeFilter = '7d' | '30d' | '90d' | '1y';

/**
 * Activity type classification
 */
export type ActivityType =
  | 'member_joined'
  | 'post_created'
  | 'comment_added'
  | 'milestone'
  | 'payment_received'
  | 'course_completed'
  | 'event_scheduled';

/**
 * Task urgency level
 */
export type TaskUrgency = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Task status
 */
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'dismissed';

/**
 * Member plan types
 */
export type MemberPlan = 'free' | 'starter' | 'growth' | 'enterprise';

/**
 * Resource type classification
 */
export type ResourceType = 'guide' | 'video' | 'webinar' | 'case_study' | 'template' | 'tutorial';

/**
 * Individual metric with change tracking
 */
export interface Metric {
  id: string;
  label: string;
  icon: string;
  value: number;
  formattedValue: string;
  change: number;
  changeType: MetricChangeType;
  changeDescription: string;
  comparisonPeriod: string;
}

/**
 * Complete dashboard metrics overview
 */
export interface DashboardMetrics {
  members: Metric;
  posts: Metric;
  comments: Metric;
  monthlyRecurringRevenue: Metric;
  lastUpdated: Date;
}

/**
 * Activity item in the recent activity feed
 */
export interface ActivityItem {
  id: string;
  type: ActivityType;
  icon: string;
  text: string;
  description: string | null;
  timestamp: Date;
  relativeTime: string;
  badge: string | null;
  metadata: Record<string, unknown>;
}

/**
 * Member information for dashboard display
 */
export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  initials: string;
  plan: MemberPlan;
  planAmount: string | null;
  joinedAt: Date;
  joinedFormatted: string;
  lastActiveAt: Date;
  lastActiveFormatted: string;
  postsCount: number;
  isActive: boolean;
}

/**
 * Content post summary for dashboard
 */
export interface ContentPost {
  id: string;
  title: string;
  author: string;
  authorId: string;
  space: string;
  spaceId: string;
  createdAt: Date;
  createdFormatted: string;
  likes: number;
  comments: number;
  views: number;
  isPinned: boolean;
  isFlagged: boolean;
}

/**
 * Pending task item
 */
export interface PendingTask {
  id: string;
  text: string;
  description: string | null;
  urgency: TaskUrgency;
  status: TaskStatus;
  createdAt: Date;
  dueAt: Date | null;
  actionUrl: string | null;
  actionLabel: string | null;
  count: number | null;
}

/**
 * Quick action button
 */
export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  description: string;
  actionUrl: string;
  requiresPermission: string | null;
}

/**
 * Recommended resource item
 */
export interface Resource {
  id: string;
  type: ResourceType;
  icon: string;
  title: string;
  description: string;
  metadata: string;
  url: string;
  estimatedMinutes: number | null;
  isExternal: boolean;
}

/**
 * Setup progress tracking
 */
export interface SetupProgress {
  totalSteps: number;
  completedSteps: number;
  percentageComplete: number;
  steps: SetupStep[];
  isComplete: boolean;
  isDismissed: boolean;
}

/**
 * Individual setup step
 */
export interface SetupStep {
  id: string;
  label: string;
  description: string;
  isCompleted: boolean;
  actionUrl: string | null;
  order: number;
}

/**
 * Activity chart data point
 */
export interface ChartDataPoint {
  date: string;
  value: number;
  label: string;
}

/**
 * Activity trends chart data
 */
export interface ActivityTrends {
  timeFilter: TimeFilter;
  dataPoints: ChartDataPoint[];
  totalValue: number;
  averageValue: number;
  peakValue: number;
  peakDate: string;
}

/**
 * Community information
 */
export interface CommunityInfo {
  id: string;
  name: string;
  avatar: string | null;
  initials: string;
  slug: string;
  liveUrl: string;
  plan: 'free' | 'starter' | 'growth' | 'enterprise';
  planDisplayName: string;
  storageUsed: number;
  storageLimit: number;
  storagePercentage: number;
}

/**
 * Complete dashboard data aggregate
 */
export interface DashboardData {
  community: CommunityInfo;
  metrics: DashboardMetrics;
  setupProgress: SetupProgress;
  activityTrends: ActivityTrends;
  recentActivity: ActivityItem[];
  pendingTasks: PendingTask[];
  quickActions: QuickAction[];
  recommendedResources: Resource[];
  topMembers: Member[];
  recentPosts: ContentPost[];
}
