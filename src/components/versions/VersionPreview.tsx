'use client';

import { useState } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { formatDateTime } from '@/lib/utils/formatters';
import type { ContentVersion } from './types';

interface VersionPreviewProps {
  version: ContentVersion;
  currentContent: string;
  isCurrent: boolean;
  onRestore: () => Promise<void>;
}

export function VersionPreview({
  version,
  currentContent,
  isCurrent,
  onRestore
}: VersionPreviewProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRestore = async () => {
    setIsRestoring(true);
    setError(null);

    try {
      await onRestore();
      setShowConfirmation(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore version');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border-color bg-surface flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Version {version.versionNumber}
            {isCurrent && (
              <span className="ml-2 px-2 py-1 bg-success/10 text-success rounded text-sm font-medium">
                Current
              </span>
            )}
          </h3>
          <p className="text-sm text-text-tertiary mt-0.5">
            {formatDateTime(version.createdAt)}
            {version.authorName && ` by ${version.authorName}`}
          </p>
        </div>

        {!isCurrent && (
          <button
            onClick={() => setShowConfirmation(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
            aria-label={`Restore version ${version.versionNumber}`}
          >
            <RotateCcw size={16} />
            Restore This Version
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-danger/10 border border-danger/30 rounded-lg flex items-start gap-2 text-danger text-sm">
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="bg-surface-elevated border border-border-color rounded-lg p-6">
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: version.content }}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => !isRestoring && setShowConfirmation(false)}
          role="dialog"
          aria-labelledby="restore-confirmation-title"
          aria-modal="true"
        >
          <div
            className="bg-surface-elevated border border-border-color rounded-lg p-6 max-w-md w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-warning/10 rounded-lg">
                <AlertTriangle size={24} className="text-warning" />
              </div>
              <div className="flex-1">
                <h3
                  id="restore-confirmation-title"
                  className="text-lg font-semibold text-text-primary mb-1"
                >
                  Restore Version {version.versionNumber}?
                </h3>
                <p className="text-sm text-text-secondary">
                  This will replace the current content with this version. The current content will be saved as a new version in history.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isRestoring}
                className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRestore}
                disabled={isRestoring}
                className="px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRestoring ? 'Restoring...' : 'Restore Version'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
