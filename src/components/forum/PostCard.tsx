'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageSquare, CheckCircle, Pin, Eye, History } from 'lucide-react';
import { formatRelativeTime, extractExcerpt, formatNumber } from '@/lib/utils/formatters';
import { VersionHistoryModal } from '@/components/versions';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string; // HTML content
    authorName: string;
    authorAvatar?: string;
    likeCount: number;
    helpfulCount: number;
    commentCount: number;
    viewCount: number;
    isPinned: boolean;
    isSolved: boolean;
    createdAt: Date | string;
    updatedAt?: Date | string;
    communityName?: string;
  };
  onClick?: () => void;
  showVersionHistory?: boolean; // Optional: control visibility of version history button
  isAuthor?: boolean; // Optional: only show version history to post author
}

export function PostCard({ post, onClick, showVersionHistory = false, isAuthor = false }: PostCardProps) {
  const [showVersionHistoryModal, setShowVersionHistoryModal] = useState(false);
  const excerpt = extractExcerpt(post.content, 200);
  const isRecent = new Date(post.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000;

  const handleRestoreVersion = async (versionNumber: number) => {
    const response = await fetch(`/api/posts/${post.id}/versions/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ versionNumber })
    });

    if (!response.ok) {
      throw new Error('Failed to restore version');
    }

    // Optionally trigger a refresh of the post data
    window.location.reload();
  };

  return (
    <>
    <Link
      href={`/posts/${post.id}`}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className="block bg-surface-elevated rounded-lg border border-border-color hover:border-primary-color/50 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Header with Badges */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1">
            {/* Title */}
            <h3 className="text-lg font-semibold text-text-primary hover:text-primary-color transition-colors line-clamp-2">
              {post.title}
            </h3>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {post.isPinned && (
              <span
                className="flex items-center gap-1 px-2 py-1 bg-warning/10 text-warning rounded text-xs font-medium"
                title="Pinned"
              >
                <Pin size={12} />
                Pinned
              </span>
            )}
            {post.isSolved && (
              <span
                className="flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded text-xs font-medium"
                title="Solved"
              >
                <CheckCircle size={12} />
                Solved
              </span>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-sm text-text-secondary line-clamp-3 mb-3">
          {excerpt}
        </p>

        {/* Author and Meta Info */}
        <div className="flex items-center gap-3 text-xs text-text-tertiary">
          <div className="flex items-center gap-2">
            {post.authorAvatar ? (
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-primary-color/10 flex items-center justify-center text-primary-color text-[10px] font-medium">
                {post.authorName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-medium text-text-secondary">{post.authorName}</span>
          </div>

          <span>•</span>

          <span className={isRecent ? 'text-primary-color font-medium' : ''}>
            {formatRelativeTime(post.createdAt)}
          </span>

          {post.communityName && (
            <>
              <span>•</span>
              <span className="text-text-secondary">{post.communityName}</span>
            </>
          )}
        </div>
      </div>

      {/* Footer with Metrics */}
      <div className="px-4 py-3 bg-surface border-t border-border-color flex items-center justify-between">
        <div className="flex items-center gap-5 text-sm text-text-tertiary">
          {/* Likes */}
          <div className="flex items-center gap-1.5 hover:text-primary-color transition-colors">
            <Heart size={16} />
            <span>{formatNumber(post.likeCount)}</span>
          </div>

          {/* Comments */}
          <div className="flex items-center gap-1.5 hover:text-primary-color transition-colors">
            <MessageSquare size={16} />
            <span>{formatNumber(post.commentCount)}</span>
          </div>

          {/* Views */}
          <div className="flex items-center gap-1.5">
            <Eye size={16} />
            <span>{formatNumber(post.viewCount)}</span>
          </div>

          {/* Version History (if enabled and is author) */}
          {showVersionHistory && isAuthor && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowVersionHistoryModal(true);
              }}
              className="flex items-center gap-1.5 hover:text-primary-color transition-colors"
              aria-label="View version history"
            >
              <History size={16} />
              <span>History</span>
            </button>
          )}
        </div>

        {/* Helpful Count (if any) */}
        {post.helpfulCount > 0 && (
          <div className="text-xs text-success font-medium">
            {formatNumber(post.helpfulCount)} helpful
          </div>
        )}
      </div>
    </Link>

    {/* Version History Modal */}
    {showVersionHistoryModal && (
      <VersionHistoryModal
        isOpen={showVersionHistoryModal}
        onClose={() => setShowVersionHistoryModal(false)}
        contentId={post.id}
        contentType="POST"
        currentContent={post.content}
        onRestore={handleRestoreVersion}
      />
    )}
    </>
  );
}
