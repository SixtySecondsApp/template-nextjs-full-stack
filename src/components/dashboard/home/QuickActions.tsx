'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Zap, FileText, UserPlus, Palette, BookOpen, Calendar, DollarSign } from 'lucide-react';
import { getQuickActions } from '@/lib/api/dashboard';
import { Skeleton } from '@/components/ui/skeleton';

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  FileText,
  UserPlus,
  Palette,
  BookOpen,
  Calendar,
  DollarSign,
};

export function QuickActions() {
  const {
    data: actions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['quick-actions'],
    queryFn: getQuickActions,
    staleTime: 300000, // 5 minutes - actions don't change frequently
  });

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-5">
        <Zap className="h-5 w-5" />
        Quick Actions
      </h3>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">Failed to load quick actions.</p>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {actions && actions.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {actions.map((action) => {
            const Icon = iconMap[action.icon] || FileText; // Fallback to FileText if icon not found
            return (
              <Link
                key={action.id}
                href={action.actionUrl}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-muted/50 hover:bg-muted border border-transparent hover:border-primary/20 rounded-lg font-medium text-sm transition-all hover:shadow-md hover:-translate-y-1"
              >
                <Icon className="h-8 w-8 text-primary" />
                <span className="text-center text-xs">{action.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {!isLoading && !error && (!actions || actions.length === 0) && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No quick actions available.
        </p>
      )}
    </div>
  );
}
