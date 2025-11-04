/**
 * Dashboard Data Transfer Objects (DTOs)
 *
 * DTOs for dashboard data transfer between layers.
 * These are serializable structures with no methods or Date objects.
 * All dates are represented as ISO 8601 strings.
 *
 * Architecture: Application Layer
 * Purpose: Data transfer between Presentation, Application, and Domain layers
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
 * Individual metric DTO
 */
export interface MetricDTO {
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
 * Complete dashboard metrics DTO
 */
export interface DashboardMetricsDTO {
  members: MetricDTO;
  posts: MetricDTO;
  comments: MetricDTO;
  monthlyRecurringRevenue: MetricDTO;
  lastUpdated: string; // ISO 8601 string
}

/**
 * Activity item DTO
 */
export interface ActivityItemDTO {
  id: string;
  type: ActivityType;
  icon: string;
  text: string;
  description: string | null;
  timestamp: string; // ISO 8601 string
  relativeTime: string;
  badge: string | null;
  metadata: Record<string, unknown>;
}

/**
 * Member DTO
 */
export interface MemberDTO {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  initials: string;
  plan: MemberPlan;
  planAmount: string | null;
  joinedAt: string; // ISO 8601 string
  joinedFormatted: string;
  lastActiveAt: string; // ISO 8601 string
  lastActiveFormatted: string;
  postsCount: number;
  isActive: boolean;
}

/**
 * Content post DTO
 */
export interface ContentPostDTO {
  id: string;
  title: string;
  author: string;
  authorId: string;
  space: string;
  spaceId: string;
  createdAt: string; // ISO 8601 string
  createdFormatted: string;
  likes: number;
  comments: number;
  views: number;
  isPinned: boolean;
  isFlagged: boolean;
}

/**
 * Pending task DTO
 */
export interface PendingTaskDTO {
  id: string;
  text: string;
  description: string | null;
  urgency: TaskUrgency;
  status: TaskStatus;
  createdAt: string; // ISO 8601 string
  dueAt: string | null; // ISO 8601 string or null
  actionUrl: string | null;
  actionLabel: string | null;
  count: number | null;
}

/**
 * Quick action DTO
 */
export interface QuickActionDTO {
  id: string;
  icon: string;
  label: string;
  description: string;
  actionUrl: string;
  requiresPermission: string | null;
}

/**
 * Resource DTO
 */
export interface ResourceDTO {
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
 * Setup step DTO
 */
export interface SetupStepDTO {
  id: string;
  label: string;
  description: string;
  isCompleted: boolean;
  actionUrl: string | null;
  order: number;
}

/**
 * Setup progress DTO
 */
export interface SetupProgressDTO {
  totalSteps: number;
  completedSteps: number;
  percentageComplete: number;
  steps: SetupStepDTO[];
  isComplete: boolean;
  isDismissed: boolean;
}

/**
 * Activity chart data point DTO
 */
export interface ChartDataPointDTO {
  date: string; // ISO 8601 date string
  value: number;
  label: string;
}

/**
 * Activity trends DTO
 */
export interface ActivityTrendsDTO {
  timeFilter: TimeFilter;
  dataPoints: ChartDataPointDTO[];
  totalValue: number;
  averageValue: number;
  peakValue: number;
  peakDate: string; // ISO 8601 date string
}

/**
 * Community information DTO
 */
export interface CommunityInfoDTO {
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
 * Complete dashboard data DTO
 */
export interface DashboardDataDTO {
  community: CommunityInfoDTO;
  metrics: DashboardMetricsDTO;
  setupProgress: SetupProgressDTO;
  activityTrends: ActivityTrendsDTO;
  recentActivity: ActivityItemDTO[];
  pendingTasks: PendingTaskDTO[];
  quickActions: QuickActionDTO[];
  recommendedResources: ResourceDTO[];
  topMembers: MemberDTO[];
  recentPosts: ContentPostDTO[];
}

/**
 * Dashboard query parameters DTO
 */
export interface DashboardQueryDTO {
  communityId: string;
  timeFilter?: TimeFilter;
  includeSetupProgress?: boolean;
  includeTrends?: boolean;
  includeActivity?: boolean;
  includeTasks?: boolean;
  includeResources?: boolean;
  includeMembers?: boolean;
  includePosts?: boolean;
  activityLimit?: number;
  tasksLimit?: number;
  membersLimit?: number;
  postsLimit?: number;
}

/**
 * Dashboard response DTO
 */
export interface DashboardResponseDTO {
  success: boolean;
  data: DashboardDataDTO;
  timestamp: string; // ISO 8601 string
}
