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
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px'
    }}>
      <MetricCard
        title={metrics.members.label}
        value={metrics.members.formattedValue}
        change={metrics.members.changeDescription}
        changeType={metrics.members.changeType}
        icon={<Users style={{ width: '20px', height: '20px' }} />}
      />
      <MetricCard
        title={metrics.posts.label}
        value={metrics.posts.formattedValue}
        change={metrics.posts.changeDescription}
        changeType={metrics.posts.changeType}
        icon={<FileText style={{ width: '20px', height: '20px' }} />}
      />
      <MetricCard
        title={metrics.comments.label}
        value={metrics.comments.formattedValue}
        change={metrics.comments.changeDescription}
        changeType={metrics.comments.changeType}
        icon={<MessageSquare style={{ width: '20px', height: '20px' }} />}
      />
      <MetricCard
        title={metrics.monthlyRecurringRevenue.label}
        value={metrics.monthlyRecurringRevenue.formattedValue}
        change={metrics.monthlyRecurringRevenue.changeDescription}
        changeType={metrics.monthlyRecurringRevenue.changeType}
        icon={<DollarSign style={{ width: '20px', height: '20px' }} />}
      />
    </div>
  );
}
