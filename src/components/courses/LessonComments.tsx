'use client';

import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { Comment } from '@/components/forum/Comment';
import { RichTextEditor } from '@/components/editor/RichTextEditor';

interface CommentData {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  likeCount: number;
  helpfulCount: number;
  createdAt: Date | string;
  updatedAt?: Date | string;
  replies?: CommentData[];
  isAuthor?: boolean;
}

interface LessonCommentsProps {
  lessonId: string;
  userId: string;
}

export function LessonComments({ lessonId, userId }: LessonCommentsProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [lessonId]);

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}/comments`);
      if (!response.ok) throw new Error('Failed to load comments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!newCommentContent || newCommentContent === '<p></p>') return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/lessons/${lessonId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newCommentContent,
          authorId: userId,
          lessonId
        })
      });

      if (!response.ok) throw new Error('Failed to post comment');

      const newComment = await response.json();
      setComments(prev => [...prev, newComment]);
      setNewCommentContent('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          authorId: userId,
          lessonId,
          parentId
        })
      });

      if (!response.ok) throw new Error('Failed to post reply');

      // Reload comments to get updated thread
      await loadComments();
    } catch (error) {
      console.error('Error posting reply:', error);
      throw error;
    }
  };

  const handleEdit = async (commentId: string, content: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      if (!response.ok) throw new Error('Failed to edit comment');

      // Reload comments to get updated data
      await loadComments();
    } catch (error) {
      console.error('Error editing comment:', error);
      throw error;
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete comment');

      // Remove comment from state
      await loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) throw new Error('Failed to like comment');

      // Reload comments to get updated like count
      await loadComments();
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  };

  const handleMarkHelpful = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/helpful`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) throw new Error('Failed to mark as helpful');

      // Reload comments to get updated helpful count
      await loadComments();
    } catch (error) {
      console.error('Error marking helpful:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center gap-2">
        <MessageSquare size={24} className="text-primary-color" />
        <h2 className="text-2xl font-bold text-text-primary">
          Discussion
        </h2>
        <span className="text-text-tertiary">({comments.length})</span>
      </div>

      {/* New Comment Composer */}
      <div className="bg-surface-elevated rounded-lg border border-border-color p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Add a comment
        </h3>

        <RichTextEditor
          initialContent={newCommentContent}
          onChange={setNewCommentContent}
          placeholder="Share your thoughts or ask a question..."
          minHeight="150px"
        />

        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={() => setNewCommentContent('')}
            disabled={isSubmitting || !newCommentContent || newCommentContent === '<p></p>'}
            className="px-6 py-2 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handlePostComment}
            disabled={isSubmitting || !newCommentContent || newCommentContent === '<p></p>'}
            className="px-6 py-2 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-12 text-text-tertiary">
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-text-tertiary">
          No comments yet. Be the first to start the discussion!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              depth={0}
              maxDepth={2}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onLike={handleLike}
              onMarkHelpful={handleMarkHelpful}
            />
          ))}
        </div>
      )}
    </div>
  );
}
