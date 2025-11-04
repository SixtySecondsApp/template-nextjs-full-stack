'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { BookOpen, ExternalLink } from 'lucide-react';
import { getRecommendedResources } from '@/lib/api/dashboard';
import { Skeleton } from '@/components/ui/skeleton';

export function RecommendedResources() {
  const {
    data: resources,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['recommended-resources'],
    queryFn: getRecommendedResources,
    staleTime: 600000, // 10 minutes - resources change infrequently
  });

  return (
    <div style={{
      background: 'var(--surface-elevated)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '24px'
    }}>
      <h3 className="text-lg font-bold flex items-center gap-2 mb-5">
        <BookOpen className="h-5 w-5" />
        Recommended for You
      </h3>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">Failed to load resources.</p>
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-3">
              <Skeleton className="h-6 w-6 mb-2" />
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {resources && resources.length > 0 && (
        <div className="space-y-3">
          {resources.map((resource) => (
            <Link
              key={resource.id}
              href={resource.url}
              target={resource.isExternal ? '_blank' : undefined}
              rel={resource.isExternal ? 'noopener noreferrer' : undefined}
              className="block p-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{resource.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {resource.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {resource.metadata}
                  </div>
                </div>
                {resource.isExternal && (
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && !error && (!resources || resources.length === 0) && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No resources available at this time.
        </p>
      )}
    </div>
  );
}
