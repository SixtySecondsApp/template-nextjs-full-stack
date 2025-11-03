'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { VersionTimeline } from './VersionTimeline';
import { VersionPreview } from './VersionPreview';
import type { ContentVersion, ContentType } from './types';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentType: ContentType;
  currentContent: string;
  onRestore: (versionNumber: number) => Promise<void>;
}

export function VersionHistoryModal({
  isOpen,
  onClose,
  contentId,
  contentType,
  currentContent,
  onRestore
}: VersionHistoryModalProps) {
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch version history
  const fetchVersions = useCallback(async () => {
    if (!isOpen) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/versions?contentId=${contentId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch version history');
      }

      const data = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.message || 'No version data available');
      }

      // Convert date strings to Date objects
      const versionsWithDates = data.data.map((v: any) => ({
        ...v,
        createdAt: new Date(v.createdAt)
      }));

      setVersions(versionsWithDates);

      // Auto-select the most recent version
      if (versionsWithDates.length > 0) {
        setSelectedVersion(versionsWithDates[0].versionNumber);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load versions');
      console.error('Error fetching versions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, contentId]);

  // Fetch on mount/open
  useEffect(() => {
    if (isOpen) {
      fetchVersions();
    }
  }, [isOpen, fetchVersions]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      window.addEventListener('keydown', handleTab);
      firstElement?.focus();

      return () => window.removeEventListener('keydown', handleTab);
    }
  }, [isOpen, versions]);

  const handleRestore = async (versionNumber: number) => {
    await onRestore(versionNumber);
    await fetchVersions(); // Refresh version list
  };

  const selectedVersionData = versions.find(
    (v) => v.versionNumber === selectedVersion
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-labelledby="version-history-title"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="h-full w-full max-w-4xl bg-surface-elevated border-l border-border-color shadow-2xl flex animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 px-6 py-4 border-b border-border-color bg-surface-elevated flex items-center justify-between">
          <div>
            <h2
              id="version-history-title"
              className="text-xl font-bold text-text-primary"
            >
              Version History
            </h2>
            <p className="text-sm text-text-tertiary mt-0.5">
              {contentType === 'POST' ? 'Post' : 'Comment'} revision history
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface transition-colors text-text-tertiary hover:text-text-primary"
            aria-label="Close version history"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 pt-20">
          {/* Timeline Sidebar */}
          <div className="w-80 border-r border-border-color overflow-y-auto bg-surface">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 size={32} className="animate-spin text-primary-color" />
              </div>
            ) : error ? (
              <div className="p-6">
                <div className="flex items-start gap-3 p-4 bg-danger/10 border border-danger/30 rounded-lg text-danger">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium mb-1">Error Loading Versions</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <VersionTimeline
                  versions={versions}
                  selectedVersion={selectedVersion}
                  onSelectVersion={setSelectedVersion}
                />
              </div>
            )}
          </div>

          {/* Preview Area */}
          <div className="flex-1 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 size={48} className="animate-spin text-primary-color" />
              </div>
            ) : selectedVersionData ? (
              <VersionPreview
                version={selectedVersionData}
                currentContent={currentContent}
                isCurrent={selectedVersionData.isCurrent || false}
                onRestore={() => handleRestore(selectedVersionData.versionNumber)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-text-tertiary">
                Select a version to preview
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
