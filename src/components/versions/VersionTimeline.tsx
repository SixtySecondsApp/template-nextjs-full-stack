'use client';

import { CheckCircle, Circle } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/formatters';
import type { ContentVersion } from './types';

interface VersionTimelineProps {
  versions: ContentVersion[];
  selectedVersion: number | null;
  onSelectVersion: (versionNumber: number) => void;
}

export function VersionTimeline({
  versions,
  selectedVersion,
  onSelectVersion
}: VersionTimelineProps) {
  if (versions.length === 0) {
    return (
      <div className="text-center py-8 text-text-tertiary">
        No version history available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-text-secondary px-4 pb-2">
        Version History
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border-color" />

        {/* Version items */}
        <div className="space-y-1">
          {versions.map((version, index) => {
            const isSelected = selectedVersion === version.versionNumber;
            const isFirst = index === 0;

            return (
              <button
                key={version.id}
                onClick={() => onSelectVersion(version.versionNumber)}
                className={`
                  relative w-full text-left px-4 py-3 rounded-lg transition-all
                  ${isSelected
                    ? 'bg-primary-color/10 border border-primary-color/30'
                    : 'hover:bg-surface border border-transparent'
                  }
                `}
                aria-label={`Version ${version.versionNumber} from ${formatRelativeTime(version.createdAt)}`}
                aria-pressed={isSelected}
              >
                {/* Timeline dot */}
                <div className="absolute left-[1.6875rem] top-1/2 -translate-y-1/2 z-10">
                  {version.isCurrent ? (
                    <CheckCircle
                      size={18}
                      className="text-success fill-current"
                      aria-label="Current version"
                    />
                  ) : (
                    <Circle
                      size={18}
                      className={`
                        ${isSelected ? 'text-primary-color fill-current' : 'text-border-color fill-white dark:fill-surface-elevated'}
                      `}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="ml-10">
                  <div className="flex items-baseline gap-2">
                    <span className={`font-semibold text-sm ${
                      isSelected ? 'text-primary-color' : 'text-text-primary'
                    }`}>
                      Version {version.versionNumber}
                    </span>

                    {version.isCurrent && (
                      <span className="px-2 py-0.5 bg-success/10 text-success rounded text-xs font-medium">
                        Current
                      </span>
                    )}

                    {isFirst && !version.isCurrent && (
                      <span className="px-2 py-0.5 bg-primary-color/10 text-primary-color rounded text-xs font-medium">
                        Latest
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-text-tertiary mt-0.5">
                    {formatRelativeTime(version.createdAt)}
                  </div>

                  {version.authorName && (
                    <div className="text-xs text-text-secondary mt-1">
                      by {version.authorName}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
