'use client';

import { useState } from 'react';
import { RotateCcw, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import type { ContentType } from './types';

interface UndeleteButtonProps {
  contentId: string;
  contentType: ContentType;
  onUndelete: (contentId: string) => Promise<void>;
  canUndelete: boolean;
  className?: string;
}

export function UndeleteButton({
  contentId,
  contentType,
  onUndelete,
  canUndelete,
  className = ''
}: UndeleteButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUndelete = async () => {
    setIsRestoring(true);
    setError(null);

    try {
      await onUndelete(contentId);
      setIsSuccess(true);

      // Auto-close confirmation after success
      setTimeout(() => {
        setShowConfirmation(false);
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore content');
    } finally {
      setIsRestoring(false);
    }
  };

  if (!canUndelete) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowConfirmation(true)}
        className={`
          flex items-center gap-2 px-3 py-1.5 bg-primary-color/10 text-primary-color rounded-lg
          hover:bg-primary-color/20 transition-colors text-sm font-medium
          ${className}
        `}
        aria-label={`Restore deleted ${contentType.toLowerCase()}`}
      >
        <RotateCcw size={14} />
        Restore
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={() => !isRestoring && setShowConfirmation(false)}
          role="dialog"
          aria-labelledby="undelete-confirmation-title"
          aria-modal="true"
        >
          <div
            className="bg-surface-elevated border border-border-color rounded-lg p-6 max-w-md w-full shadow-lg animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success state */}
            {isSuccess ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
                  <CheckCircle size={32} className="text-success" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {contentType === 'POST' ? 'Post' : 'Comment'} Restored
                </h3>
                <p className="text-sm text-text-secondary">
                  The {contentType.toLowerCase()} has been successfully restored
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-primary-color/10 rounded-lg">
                    <RotateCcw size={24} className="text-primary-color" />
                  </div>
                  <div className="flex-1">
                    <h3
                      id="undelete-confirmation-title"
                      className="text-lg font-semibold text-text-primary mb-1"
                    >
                      Restore {contentType === 'POST' ? 'Post' : 'Comment'}?
                    </h3>
                    <p className="text-sm text-text-secondary">
                      This will restore the deleted {contentType.toLowerCase()} and make it visible again.
                    </p>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-lg flex items-start gap-2 text-danger text-sm">
                    <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 justify-end">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    disabled={isRestoring}
                    className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors text-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUndelete}
                    disabled={isRestoring}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRestoring ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Restoring...
                      </>
                    ) : (
                      <>
                        <RotateCcw size={16} />
                        Restore
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
