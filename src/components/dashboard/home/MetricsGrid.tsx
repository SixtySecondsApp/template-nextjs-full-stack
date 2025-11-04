'use client';

import { useQuery } from '@tanstack/react-query';
import { Users, FileText, MessageSquare, DollarSign } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { MetricsGridSkeleton } from './MetricCardSkeleton';
import { getDashboardMetrics } from '@/lib/api/dashboard';
import type { TimeFilter } from '@/application/dto/dashboard.dto';

interface MetricsGridProps {
  timeFilter?: TimeFilter;
}

export function MetricsGrid({ timeFilter = '30d' }: MetricsGridProps) {
  const {
    data: metrics,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard-metrics', timeFilter],
    queryFn: () => getDashboardMetrics(timeFilter),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          Failed to load metrics. Please try again later.
        </p>
      </div>
    );
  }

  if (isLoading || !metrics) {
    return <MetricsGridSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title={metrics.members.label}
        value={metrics.members.formattedValue}
        change={metrics.members.changeDescription}
        changeType={metrics.members.changeType}
        icon={<Users className="h-5 w-5" />}
      />
      <MetricCard
        title={metrics.posts.label}
        value={metrics.posts.formattedValue}
        change={metrics.posts.changeDescription}
        changeType={metrics.posts.changeType}
        icon={<FileText className="h-5 w-5" />}
      />
      <MetricCard
        title={metrics.comments.label}
        value={metrics.comments.formattedValue}
        change={metrics.comments.changeDescription}
        changeType={metrics.comments.changeType}
        icon={<MessageSquare className="h-5 w-5" />}
      />
      <MetricCard
        title={metrics.monthlyRecurringRevenue.label}
        value={metrics.monthlyRecurringRevenue.formattedValue}
        change={metrics.monthlyRecurringRevenue.changeDescription}
        changeType={metrics.monthlyRecurringRevenue.changeType}
        icon={<DollarSign className="h-5 w-5" />}
      />
    </div>
  );
}
