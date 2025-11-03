'use client';

import { useState } from 'react';
import { Heart, MessageSquare, MoreVertical, ThumbsUp, Edit, Trash2 } from 'lucide-react';
import { formatRelativeTime, formatNumber } from '@/lib/utils/formatters';
import { RichTextEditor } from '@/components/editor/RichTextEditor';

interface CommentProps {
  comment: {
    id: string;
    content: string; // HTML content
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    likeCount: number;
    helpfulCount: number;
    createdAt: Date | string;
    updatedAt?: Date | string;
    replies?: CommentProps['comment'][];
    isAuthor?: boolean;
  };
  depth?: number;
  maxDepth?: number;
  onReply?: (parentId: string, content: string) => Promise<void>;
  onEdit?: (commentId: string, content: string) => Promise<void>;
  onDelete?: (commentId: string) => Promise<void>;
  onLike?: (commentId: string) => Promise<void>;
  onMarkHelpful?: (commentId: string) => Promise<void>;
}

export function Comment({
  comment,
  depth = 0,
  maxDepth = 2,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onMarkHelpful
}: CommentProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMarkedHelpful, setIsMarkedHelpful] = useState(false);

  const canReply = depth < maxDepth;
  const isNested = depth > 0;

  const handleReply = async () => {
    if (!replyContent || replyContent === '<p></p>') return;

    setIsSubmitting(true);
    try {
      await onReply?.(comment.id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Failed to post reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editContent || editContent === '<p></p>') return;

    setIsSubmitting(true);
    try {
      await onEdit?.(comment.id, editContent);
      setShowEditForm(false);
    } catch (error) {
      console.error('Failed to edit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await onDelete?.(comment.id);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleLike = async () => {
    try {
      await onLike?.(comment.id);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const handleMarkHelpful = async () => {
    try {
      await onMarkHelpful?.(comment.id);
      setIsMarkedHelpful(!isMarkedHelpful);
    } catch (error) {
      console.error('Failed to mark as helpful:', error);
    }
  };

  return (
    <div className={`comment-container ${isNested ? 'ml-6 pl-4 border-l-2 border-border-color' : ''}`}>
      <div className="bg-surface-elevated rounded-lg p-4 mb-3">
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            {comment.authorAvatar ? (
              <img
                src={comment.authorAvatar}
                alt={comment.authorName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-color/10 flex items-center justify-center text-primary-color text-sm font-medium">
                {comment.authorName.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-text-primary">
                  {comment.authorName}
                </span>
                {comment.isAuthor && (
                  <span className="px-2 py-0.5 bg-primary-color/10 text-primary-color rounded text-xs font-medium">
                    Author
                  </span>
                )}
              </div>
              <span className="text-xs text-text-tertiary">
                {formatRelativeTime(comment.createdAt)}
                {comment.updatedAt && comment.updatedAt !== comment.createdAt && ' (edited)'}
              </span>
            </div>
          </div>

          {/* Actions Menu */}
          {comment.isAuthor && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded hover:bg-surface transition-colors text-text-tertiary"
              >
                <MoreVertical size={16} />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-40 bg-surface-elevated border border-border-color rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setShowEditForm(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-surface transition-colors flex items-center gap-2"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-danger hover:bg-danger/10 transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comment Content or Edit Form */}
        {showEditForm ? (
          <div className="mb-3">
            <RichTextEditor
              initialContent={editContent}
              onChange={setEditContent}
              placeholder="Edit your comment..."
              minHeight="120px"
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handleEdit}
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-primary-color text-white rounded hover:bg-primary-hover transition-colors text-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setShowEditForm(false);
                  setEditContent(comment.content);
                }}
                className="px-4 py-1.5 text-text-secondary hover:text-text-primary transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className="prose prose-sm dark:prose-invert max-w-none mb-3 text-text-primary"
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors ${
              isLiked
                ? 'text-danger'
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            <Heart size={16} className={isLiked ? 'fill-current' : ''} />
            <span>{formatNumber(comment.likeCount + (isLiked ? 1 : 0))}</span>
          </button>

          <button
            onClick={handleMarkHelpful}
            className={`flex items-center gap-1.5 transition-colors ${
              isMarkedHelpful
                ? 'text-success'
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            <ThumbsUp size={16} className={isMarkedHelpful ? 'fill-current' : ''} />
            <span>{formatNumber(comment.helpfulCount + (isMarkedHelpful ? 1 : 0))} Helpful</span>
          </button>

          {canReply && onReply && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1.5 text-text-tertiary hover:text-primary-color transition-colors"
            >
              <MessageSquare size={16} />
              <span>Reply</span>
            </button>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4 pl-4 border-l-2 border-primary-color/30">
            <RichTextEditor
              onChange={setReplyContent}
              placeholder="Write a reply..."
              minHeight="120px"
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handleReply}
                disabled={isSubmitting || !replyContent || replyContent === '<p></p>'}
                className="px-4 py-1.5 bg-primary-color text-white rounded hover:bg-primary-hover transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Posting...' : 'Post Reply'}
              </button>
              <button
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyContent('');
                }}
                className="px-4 py-1.5 text-text-secondary hover:text-text-primary transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies-container">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              maxDepth={maxDepth}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
              onMarkHelpful={onMarkHelpful}
            />
          ))}
        </div>
      )}
    </div>
  );
}
