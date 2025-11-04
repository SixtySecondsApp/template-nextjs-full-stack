'use client';

import { formatDistanceToNow } from 'date-fns';
import type { ActivityItemDTO } from '@/application/dto/dashboard.dto';

interface ActivityFeedProps {
  activities: ActivityItemDTO[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (icon: string) => {
    return <span className="text-base">{icon}</span>;
  };

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center gap-3 p-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors"
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            {getActivityIcon(activity.icon)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-foreground truncate">
              {activity.text}
            </div>
            <div className="text-xs text-muted-foreground">
              {activity.relativeTime}
            </div>
          </div>
          {activity.badge && (
            <span className="flex-shrink-0 px-2 py-1 bg-green-500 text-white text-xs rounded font-semibold">
              {activity.badge}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
