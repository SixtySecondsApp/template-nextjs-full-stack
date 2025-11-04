'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { MetricChangeType } from '@/application/dto/dashboard.dto';
import { MetricCardSkeleton } from './MetricCardSkeleton';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: MetricChangeType;
  icon: React.ReactNode;
  loading?: boolean;
}

export function MetricCard({
  title,
  value,
  change,
  changeType,
  icon,
  loading = false,
}: MetricCardProps) {
  if (loading) {
    return <MetricCardSkeleton />;
  }

  const changeColorClass =
    changeType === 'positive'
      ? 'text-green-600 dark:text-green-500'
      : changeType === 'negative'
      ? 'text-red-600 dark:text-red-500'
      : 'text-gray-600 dark:text-gray-400';

  const ChangeIcon =
    changeType === 'positive'
      ? TrendingUp
      : changeType === 'negative'
      ? TrendingDown
      : Minus;

  return (
    <div className="group rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-2xl">
            {icon}
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {title}
          </div>
        </div>
        <div className="text-3xl font-bold mb-2">{value}</div>
        <div className={`flex items-center gap-1 text-sm ${changeColorClass}`}>
          <ChangeIcon className="h-4 w-4" />
          <span>{change}</span>
        </div>
      </div>
    </div>
  );
}
