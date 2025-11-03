'use client';

import { useState, useEffect } from 'react';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { X, AlertCircle } from 'lucide-react';

interface PostComposerProps {
  initialTitle?: string;
  initialContent?: string;
  initialCommunityId?: string;
  onPublish?: (data: PostData) => Promise<void>;
  onSaveDraft?: (data: PostData) => Promise<void>;
  onCancel?: () => void;
  communities?: Community[];
  isEditing?: boolean;
}

interface Community {
  id: string;
  name: string;
}

interface PostData {
  title: string;
  content: string;
  communityId: string;
}

interface ValidationErrors {
  title?: string;
  content?: string;
  communityId?: string;
}

export function PostComposer({
  initialTitle = '',
  initialContent = '',
  initialCommunityId = '',
  onPublish,
  onSaveDraft,
  onCancel,
  communities = [],
  isEditing = false
}: PostComposerProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [communityId, setCommunityId] = useState(initialCommunityId);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Character count
  const titleLength = title.length;
  const titleMaxLength = 200;
  const titleMinLength = 3;

  // Load draft from localStorage on mount (if not editing)
  useEffect(() => {
    if (!isEditing) {
      try {
        const savedTitle = localStorage.getItem('new-post-title');
        const savedCommunityId = localStorage.getItem('new-post-community');
        if (savedTitle) setTitle(savedTitle);
        if (savedCommunityId) setCommunityId(savedCommunityId);
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [isEditing]);

  // Auto-save title and community to localStorage
  useEffect(() => {
    if (!isEditing) {
      const timer = setTimeout(() => {
        try {
          localStorage.setItem('new-post-title', title);
          localStorage.setItem('new-post-community', communityId);
        } catch (error) {
          console.error('Failed to save draft:', error);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [title, communityId, isEditing]);

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (title.length < titleMinLength) {
      newErrors.title = `Title must be at least ${titleMinLength} characters`;
    } else if (title.length > titleMaxLength) {
      newErrors.title = `Title must not exceed ${titleMaxLength} characters`;
    }

    if (!content || content === '<p></p>') {
      newErrors.content = 'Content is required';
    }

    if (!communityId) {
      newErrors.communityId = 'Please select a community';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = async () => {
    if (!validate()) return;

    setIsPublishing(true);
    setErrors({});
    setSuccessMessage('');

    try {
      await onPublish?.({ title, content, communityId });
      setSuccessMessage('Post published successfully!');

      // Clear draft from localStorage
      try {
        localStorage.removeItem('new-post-title');
        localStorage.removeItem('new-post-community');
        localStorage.removeItem('new-post-draft');
      } catch (error) {
        console.error('Failed to clear draft:', error);
      }

      // Reset form after short delay
      setTimeout(() => {
        setTitle('');
        setContent('');
        setCommunityId('');
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      setErrors({ content: error instanceof Error ? error.message : 'Failed to publish post' });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!title && !content) {
      setErrors({ title: 'Cannot save empty draft' });
      return;
    }

    setIsSavingDraft(true);
    setErrors({});
    setSuccessMessage('');

    try {
      await onSaveDraft?.({ title, content, communityId });
      setSuccessMessage('Draft saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ content: error instanceof Error ? error.message : 'Failed to save draft' });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleCancel = () => {
    if (title || content !== '<p></p>') {
      setShowCancelConfirm(true);
    } else {
      onCancel?.();
    }
  };

  const confirmCancel = () => {
    // Clear draft from localStorage
    try {
      localStorage.removeItem('new-post-title');
      localStorage.removeItem('new-post-community');
      localStorage.removeItem('new-post-draft');
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }

    setShowCancelConfirm(false);
    onCancel?.();
  };

  return (
    <div className="bg-surface-elevated rounded-lg shadow-md border border-border-color">
      {/* Header */}
      <div className="p-6 border-b border-border-color">
        <h2 className="text-2xl font-bold text-text-primary">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h2>
      </div>

      {/* Form */}
      <div className="p-6 space-y-4">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-success/10 border border-success/20 text-success rounded-lg p-3 text-sm">
            {successMessage}
          </div>
        )}

        {/* Community Selector */}
        {communities.length > 0 && (
          <div>
            <label htmlFor="community" className="block text-sm font-medium text-text-primary mb-2">
              Community *
            </label>
            <select
              id="community"
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
              className="w-full px-4 py-2 border border-border-color rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="">Select a community...</option>
              {communities.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.name}
                </option>
              ))}
            </select>
            {errors.communityId && (
              <p className="mt-1 text-sm text-danger flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.communityId}
              </p>
            )}
          </div>
        )}

        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-2">
            Title *
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter post title (3-200 characters)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={titleMaxLength}
            className="w-full text-xl font-semibold border-b border-border-color pb-3 bg-transparent text-text-primary focus:outline-none focus:border-primary-color placeholder:text-text-tertiary"
          />
          <div className="mt-2 flex items-center justify-between">
            <div>
              {errors.title && (
                <p className="text-sm text-danger flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.title}
                </p>
              )}
            </div>
            <p className={`text-xs ${
              titleLength > titleMaxLength * 0.9
                ? 'text-danger'
                : titleLength < titleMinLength
                ? 'text-text-tertiary'
                : 'text-text-secondary'
            }`}>
              {titleLength} / {titleMaxLength}
            </p>
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Content *
          </label>
          <RichTextEditor
            initialContent={content}
            onChange={setContent}
            placeholder="Write your post content... You can use markdown shortcuts like **bold** or # heading"
            minHeight="300px"
            autoSave={!isEditing}
            autoSaveKey="new-post-draft"
          />
          {errors.content && (
            <p className="mt-2 text-sm text-danger flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.content}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-border-color flex items-center justify-between">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          Cancel
        </button>

        <div className="flex items-center gap-3">
          {!isEditing && onSaveDraft && (
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSavingDraft || isPublishing}
              className="px-5 py-2 border border-border-color rounded-lg text-text-primary hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingDraft ? 'Saving...' : 'Save Draft'}
            </button>
          )}

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing || isSavingDraft}
            className="px-6 py-2 bg-primary-color text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isPublishing ? 'Publishing...' : isEditing ? 'Update Post' : 'Publish Post'}
          </button>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-elevated rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-bold text-text-primary mb-2">Discard changes?</h3>
            <p className="text-text-secondary mb-6">
              You have unsaved changes. Are you sure you want to discard them?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                Keep Editing
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition-colors"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
