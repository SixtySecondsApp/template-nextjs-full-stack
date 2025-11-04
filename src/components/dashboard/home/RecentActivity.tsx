'use client';

import { useQuery } from '@tanstack/react-query';
import { Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ActivityFeed } from './ActivityFeed';
import { ActivityFeedSkeleton } from './ActivityFeedSkeleton';
import { getRecentActivity } from '@/lib/api/dashboard';

export function RecentActivity() {
  const {
    data: activities,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => getRecentActivity(5),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <div style={{
      background: 'var(--surface-elevated)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '24px'
    }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </h3>
        <Link
          href="/dashboard/activity"
          className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load recent activity.
          </p>
        </div>
      )}

      {isLoading && <ActivityFeedSkeleton />}

      {activities && <ActivityFeed activities={activities} />}

      {!isLoading && !error && (!activities || activities.length === 0) && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No recent activity to display.
        </p>
      )}
    </div>
  );
}
