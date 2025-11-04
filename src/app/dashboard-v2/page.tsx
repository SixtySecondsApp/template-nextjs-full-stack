import { Suspense } from 'react';
import { Metadata } from 'next';
import { WelcomeBanner } from '@/components/dashboard/home/WelcomeBanner';
import { WelcomeBannerSkeleton } from '@/components/dashboard/home/WelcomeBannerSkeleton';
import { MetricsGrid } from '@/components/dashboard/home/MetricsGrid';
import { MetricCardSkeleton } from '@/components/dashboard/home/MetricCardSkeleton';
import { ActivityGraph } from '@/components/dashboard/home/ActivityGraph';
import { ActivityGraphSkeleton } from '@/components/dashboard/home/ActivityGraphSkeleton';
import { RecentActivity } from '@/components/dashboard/home/RecentActivity';
import { ActivityFeedSkeleton } from '@/components/dashboard/home/ActivityFeedSkeleton';
import { PendingTasks } from '@/components/dashboard/home/PendingTasks';
import { QuickActions } from '@/components/dashboard/home/QuickActions';
import { RecommendedResources } from '@/components/dashboard/home/RecommendedResources';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Dashboard | Community OS',
  description: 'Overview of your community performance',
};

/**
 * Dashboard V2 Home Page
 *
 * Main dashboard landing page based on the Community OS design with:
 * - Welcome banner with setup checklist
 * - Key metrics (Members, Posts, Comments, MRR)
 * - Activity trends graph
 * - Recent activity feed
 * - Pending tasks
 * - Quick actions
 * - Recommended resources
 */

// Mock data for initial implementation
const mockSetupProgress = {
  totalSteps: 4,
  completedSteps: 1,
  percentageComplete: 25,
  isComplete: false,
  isDismissed: false,
  steps: [
    {
      id: '1',
      label: 'Customize your branding',
      description: 'Upload logo and set colors',
      isCompleted: true,
      actionUrl: '/dashboard-v2/customize',
      order: 1,
    },
    {
      id: '2',
      label: 'Create your first post',
      description: 'Welcome your community',
      isCompleted: false,
      actionUrl: '/dashboard-v2/content/new',
      order: 2,
    },
    {
      id: '3',
      label: 'Invite 5 members',
      description: 'Build your community',
      isCompleted: false,
      actionUrl: '/dashboard-v2/members/invite',
      order: 3,
    },
    {
      id: '4',
      label: 'Set up pricing',
      description: 'Configure membership tiers',
      isCompleted: false,
      actionUrl: '/dashboard-v2/pricing',
      order: 4,
    },
  ],
};

export default function DashboardV2Page() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner with Setup Progress */}
        <Suspense fallback={<WelcomeBannerSkeleton />}>
          <WelcomeBanner
            setupProgress={mockSetupProgress}
            communityName="Community OS"
          />
        </Suspense>

        {/* Key Metrics Grid */}
        <Suspense fallback={<MetricCardSkeleton />}>
          <MetricsGrid timeFilter="30d" />
        </Suspense>

        {/* Activity Graph */}
        <Suspense fallback={<ActivityGraphSkeleton />}>
          <ActivityGraph />
        </Suspense>

        {/* Two Column Layout: Recent Activity & Pending Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Suspense
              fallback={
                <div className="rounded-xl border bg-card p-6">
                  <Skeleton className="h-6 w-40 mb-5" />
                  <ActivityFeedSkeleton />
                </div>
              }
            >
              <RecentActivity />
            </Suspense>
          </div>

          <div>
            <Suspense
              fallback={
                <div className="rounded-xl border bg-card p-6">
                  <Skeleton className="h-6 w-40 mb-5" />
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                </div>
              }
            >
              <PendingTasks />
            </Suspense>
          </div>
        </div>

        {/* Quick Actions */}
        <Suspense
          fallback={
            <div className="rounded-xl border bg-card p-6">
              <Skeleton className="h-6 w-32 mb-5" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          }
        >
          <QuickActions />
        </Suspense>

        {/* Recommended Resources */}
        <Suspense
          fallback={
            <div className="rounded-xl border bg-card p-6">
              <Skeleton className="h-6 w-48 mb-5" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </div>
          }
        >
          <RecommendedResources />
        </Suspense>
      </div>
    </div>
  );
}
