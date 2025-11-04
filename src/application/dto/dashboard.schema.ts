/**
 * Dashboard Zod Validation Schemas
 *
 * Comprehensive validation schemas for all dashboard DTOs.
 * Used for runtime validation in API routes and application layer.
 *
 * Architecture: Application Layer
 * Purpose: Runtime type validation and error reporting
 */

import { z } from 'zod';

/**
 * Enum schemas for dashboard types
 */
export const MetricChangeTypeSchema = z.enum(['positive', 'negative', 'neutral']);

export const TimeFilterSchema = z.enum(['7d', '30d', '90d', '1y']);

export const ActivityTypeSchema = z.enum([
  'member_joined',
  'post_created',
  'comment_added',
  'milestone',
  'payment_received',
  'course_completed',
  'event_scheduled',
]);

export const TaskUrgencySchema = z.enum(['low', 'medium', 'high', 'urgent']);

export const TaskStatusSchema = z.enum(['pending', 'in_progress', 'completed', 'dismissed']);

export const MemberPlanSchema = z.enum(['free', 'starter', 'growth', 'enterprise']);

export const ResourceTypeSchema = z.enum([
  'guide',
  'video',
  'webinar',
  'case_study',
  'template',
  'tutorial',
]);

/**
 * Individual metric schema
 */
export const MetricDTOSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  icon: z.string().min(1),
  value: z.number().nonnegative(),
  formattedValue: z.string().min(1),
  change: z.number(),
  changeType: MetricChangeTypeSchema,
  changeDescription: z.string().min(1),
  comparisonPeriod: z.string().min(1),
});

/**
 * Dashboard metrics schema
 */
export const DashboardMetricsDTOSchema = z.object({
  members: MetricDTOSchema,
  posts: MetricDTOSchema,
  comments: MetricDTOSchema,
  monthlyRecurringRevenue: MetricDTOSchema,
  lastUpdated: z.string().datetime(),
});

/**
 * Activity item schema
 */
export const ActivityItemDTOSchema = z.object({
  id: z.string().min(1),
  type: ActivityTypeSchema,
  icon: z.string().min(1),
  text: z.string().min(1),
  description: z.string().nullable(),
  timestamp: z.string().datetime(),
  relativeTime: z.string().min(1),
  badge: z.string().nullable(),
  metadata: z.record(z.string(), z.unknown()),
});

/**
 * Member schema
 */
export const MemberDTOSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  avatar: z.string().url().nullable(),
  initials: z.string().min(1).max(3),
  plan: MemberPlanSchema,
  planAmount: z.string().nullable(),
  joinedAt: z.string().datetime(),
  joinedFormatted: z.string().min(1),
  lastActiveAt: z.string().datetime(),
  lastActiveFormatted: z.string().min(1),
  postsCount: z.number().nonnegative(),
  isActive: z.boolean(),
});

/**
 * Content post schema
 */
export const ContentPostDTOSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  author: z.string().min(1),
  authorId: z.string().min(1),
  space: z.string().min(1),
  spaceId: z.string().min(1),
  createdAt: z.string().datetime(),
  createdFormatted: z.string().min(1),
  likes: z.number().nonnegative(),
  comments: z.number().nonnegative(),
  views: z.number().nonnegative(),
  isPinned: z.boolean(),
  isFlagged: z.boolean(),
});

/**
 * Pending task schema
 */
export const PendingTaskDTOSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  description: z.string().nullable(),
  urgency: TaskUrgencySchema,
  status: TaskStatusSchema,
  createdAt: z.string().datetime(),
  dueAt: z.string().datetime().nullable(),
  actionUrl: z.string().url().nullable(),
  actionLabel: z.string().nullable(),
  count: z.number().positive().nullable(),
});

/**
 * Quick action schema
 */
export const QuickActionDTOSchema = z.object({
  id: z.string().min(1),
  icon: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1),
  actionUrl: z.string().min(1),
  requiresPermission: z.string().nullable(),
});

/**
 * Resource schema
 */
export const ResourceDTOSchema = z.object({
  id: z.string().min(1),
  type: ResourceTypeSchema,
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  metadata: z.string().min(1),
  url: z.string().url(),
  estimatedMinutes: z.number().positive().nullable(),
  isExternal: z.boolean(),
});

/**
 * Setup step schema
 */
export const SetupStepDTOSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1),
  isCompleted: z.boolean(),
  actionUrl: z.string().url().nullable(),
  order: z.number().nonnegative(),
});

/**
 * Setup progress schema
 */
export const SetupProgressDTOSchema = z.object({
  totalSteps: z.number().positive(),
  completedSteps: z.number().nonnegative(),
  percentageComplete: z.number().min(0).max(100),
  steps: z.array(SetupStepDTOSchema),
  isComplete: z.boolean(),
  isDismissed: z.boolean(),
});

/**
 * Chart data point schema
 */
export const ChartDataPointDTOSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  value: z.number().nonnegative(),
  label: z.string().min(1),
});

/**
 * Activity trends schema
 */
export const ActivityTrendsDTOSchema = z.object({
  timeFilter: TimeFilterSchema,
  dataPoints: z.array(ChartDataPointDTOSchema),
  totalValue: z.number().nonnegative(),
  averageValue: z.number().nonnegative(),
  peakValue: z.number().nonnegative(),
  peakDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

/**
 * Community information schema
 */
export const CommunityInfoDTOSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  avatar: z.string().url().nullable(),
  initials: z.string().min(1).max(3),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  liveUrl: z.string().url(),
  plan: z.enum(['free', 'starter', 'growth', 'enterprise']),
  planDisplayName: z.string().min(1),
  storageUsed: z.number().nonnegative(),
  storageLimit: z.number().positive(),
  storagePercentage: z.number().min(0).max(100),
});

/**
 * Complete dashboard data schema
 */
export const DashboardDataDTOSchema = z.object({
  community: CommunityInfoDTOSchema,
  metrics: DashboardMetricsDTOSchema,
  setupProgress: SetupProgressDTOSchema,
  activityTrends: ActivityTrendsDTOSchema,
  recentActivity: z.array(ActivityItemDTOSchema),
  pendingTasks: z.array(PendingTaskDTOSchema),
  quickActions: z.array(QuickActionDTOSchema),
  recommendedResources: z.array(ResourceDTOSchema),
  topMembers: z.array(MemberDTOSchema),
  recentPosts: z.array(ContentPostDTOSchema),
});

/**
 * Dashboard query parameters schema
 */
export const DashboardQueryDTOSchema = z.object({
  communityId: z.string().min(1),
  timeFilter: TimeFilterSchema.optional().default('30d'),
  includeSetupProgress: z.boolean().optional().default(true),
  includeTrends: z.boolean().optional().default(true),
  includeActivity: z.boolean().optional().default(true),
  includeTasks: z.boolean().optional().default(true),
  includeResources: z.boolean().optional().default(true),
  includeMembers: z.boolean().optional().default(true),
  includePosts: z.boolean().optional().default(true),
  activityLimit: z.number().positive().max(100).optional().default(10),
  tasksLimit: z.number().positive().max(50).optional().default(10),
  membersLimit: z.number().positive().max(100).optional().default(10),
  postsLimit: z.number().positive().max(100).optional().default(10),
});

/**
 * Dashboard response schema
 */
export const DashboardResponseDTOSchema = z.object({
  success: z.boolean(),
  data: DashboardDataDTOSchema,
  timestamp: z.string().datetime(),
});

/**
 * Request schemas for API routes
 */

/**
 * GET /api/dashboard query parameters
 */
export const GetDashboardQuerySchema = z.object({
  timeFilter: TimeFilterSchema.optional(),
  includeSetupProgress: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  includeTrends: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  includeActivity: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  includeTasks: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  includeResources: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  includeMembers: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  includePosts: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  activityLimit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  tasksLimit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  membersLimit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  postsLimit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
});

/**
 * PATCH /api/dashboard/setup-progress request body
 */
export const UpdateSetupProgressRequestSchema = z.object({
  stepId: z.string().min(1).optional(),
  isDismissed: z.boolean().optional(),
});

/**
 * POST /api/dashboard/tasks request body (mark task complete)
 */
export const UpdateTaskRequestSchema = z.object({
  taskId: z.string().min(1),
  status: TaskStatusSchema,
});

/**
 * Error response schema
 */
export const DashboardErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string().min(1),
  errors: z.array(z.object({ path: z.string(), message: z.string() })).optional(),
  timestamp: z.string().datetime(),
});

/**
 * Type exports for use in application
 */
export type MetricChangeType = z.infer<typeof MetricChangeTypeSchema>;
export type TimeFilter = z.infer<typeof TimeFilterSchema>;
export type ActivityType = z.infer<typeof ActivityTypeSchema>;
export type TaskUrgency = z.infer<typeof TaskUrgencySchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type MemberPlan = z.infer<typeof MemberPlanSchema>;
export type ResourceType = z.infer<typeof ResourceTypeSchema>;
export type MetricDTO = z.infer<typeof MetricDTOSchema>;
export type DashboardMetricsDTO = z.infer<typeof DashboardMetricsDTOSchema>;
export type ActivityItemDTO = z.infer<typeof ActivityItemDTOSchema>;
export type MemberDTO = z.infer<typeof MemberDTOSchema>;
export type ContentPostDTO = z.infer<typeof ContentPostDTOSchema>;
export type PendingTaskDTO = z.infer<typeof PendingTaskDTOSchema>;
export type QuickActionDTO = z.infer<typeof QuickActionDTOSchema>;
export type ResourceDTO = z.infer<typeof ResourceDTOSchema>;
export type SetupStepDTO = z.infer<typeof SetupStepDTOSchema>;
export type SetupProgressDTO = z.infer<typeof SetupProgressDTOSchema>;
export type ChartDataPointDTO = z.infer<typeof ChartDataPointDTOSchema>;
export type ActivityTrendsDTO = z.infer<typeof ActivityTrendsDTOSchema>;
export type CommunityInfoDTO = z.infer<typeof CommunityInfoDTOSchema>;
export type DashboardDataDTO = z.infer<typeof DashboardDataDTOSchema>;
export type DashboardQueryDTO = z.infer<typeof DashboardQueryDTOSchema>;
export type DashboardResponseDTO = z.infer<typeof DashboardResponseDTOSchema>;
export type GetDashboardQuery = z.infer<typeof GetDashboardQuerySchema>;
export type UpdateSetupProgressRequest = z.infer<typeof UpdateSetupProgressRequestSchema>;
export type UpdateTaskRequest = z.infer<typeof UpdateTaskRequestSchema>;
export type DashboardErrorResponse = z.infer<typeof DashboardErrorResponseSchema>;
