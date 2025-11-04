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
 * Dashboard Home Page
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
      actionUrl: '/dashboard/customize',
      order: 1,
    },
    {
      id: '2',
      label: 'Create your first post',
      description: 'Welcome your community',
      isCompleted: false,
      actionUrl: '/dashboard/content/new',
      order: 2,
    },
    {
      id: '3',
      label: 'Invite 5 members',
      description: 'Build your community',
      isCompleted: false,
      actionUrl: '/dashboard/members/invite',
      order: 3,
    },
    {
      id: '4',
      label: 'Set up pricing',
      description: 'Configure membership tiers',
      isCompleted: false,
      actionUrl: '/dashboard/pricing',
      order: 4,
    },
  ],
};

export default function DashboardPage() {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Welcome Banner with Setup Progress */}
        <div style={{ marginBottom: '32px' }}>
          <Suspense fallback={<WelcomeBannerSkeleton />}>
            <WelcomeBanner
              setupProgress={mockSetupProgress}
              communityName="Community OS"
            />
          </Suspense>
        </div>

        {/* Key Metrics Grid */}
        <div style={{ marginBottom: '32px' }}>
          <Suspense fallback={<MetricCardSkeleton />}>
            <MetricsGrid timeFilter="30d" />
          </Suspense>
        </div>

        {/* Activity Graph */}
        <div style={{ marginBottom: '24px' }}>
          <Suspense fallback={<ActivityGraphSkeleton />}>
            <ActivityGraph />
          </Suspense>
        </div>

        {/* Two Column Layout: Recent Activity & Pending Tasks */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          marginBottom: '24px'
        }}>
          <div>
            <Suspense fallback={<ActivityFeedSkeleton />}>
              <RecentActivity />
            </Suspense>
          </div>

          <div>
            <Suspense fallback={
              <div style={{
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <Skeleton className="h-6 w-40 mb-5" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </div>
            }>
              <PendingTasks />
            </Suspense>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '24px' }}>
          <Suspense fallback={
            <div style={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <Skeleton className="h-6 w-32 mb-5" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          }>
            <QuickActions />
          </Suspense>
        </div>

        {/* Recommended Resources */}
        <Suspense fallback={
          <div style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <Skeleton className="h-6 w-48 mb-5" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        }>
          <RecommendedResources />
        </Suspense>
      </div>
    </div>
  );
}
