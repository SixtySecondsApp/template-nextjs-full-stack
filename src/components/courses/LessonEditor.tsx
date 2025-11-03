'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { LessonDto, LessonType, CreateLessonDto } from '@/application/dtos/lesson.dto';
import { RichTextEditor } from '@/components/editor/RichTextEditor';

interface LessonEditorProps {
  lesson: Partial<LessonDto>;
  onSave: (lesson: CreateLessonDto | LessonDto) => void;
  onCancel: () => void;
}

export function LessonEditor({ lesson, onSave, onCancel }: LessonEditorProps) {
  const [title, setTitle] = useState(lesson.title || '');
  const [type, setType] = useState<LessonType>(lesson.type || LessonType.TEXT);
  const [content, setContent] = useState(lesson.content || '');
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl || '');
  const [pdfUrl, setPdfUrl] = useState(lesson.pdfUrl || '');
  const [dripDate, setDripDate] = useState(
    lesson.dripAvailableAt ? new Date(lesson.dripAvailableAt).toISOString().split('T')[0] : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const lessonData = {
      ...lesson,
      title,
      type,
      content,
      videoUrl: type === LessonType.VIDEO_EMBED ? videoUrl : null,
      pdfUrl: type === LessonType.PDF ? pdfUrl : null,
      dripAvailableAt: dripDate ? new Date(dripDate).toISOString() : null
    };

    onSave(lessonData as CreateLessonDto | LessonDto);
  };

  // Extract video ID for preview
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const renderTypeSpecificFields = () => {
    switch (type) {
      case LessonType.TEXT:
        return (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Lesson Content
            </label>
            <RichTextEditor
              initialContent={content}
              onChange={setContent}
              placeholder="Write your lesson content here..."
              minHeight="300px"
            />
          </div>
        );

      case LessonType.VIDEO_EMBED:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium text-text-secondary mb-2">
                Video URL (YouTube/Vimeo)
              </label>
              <input
                id="videoUrl"
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-4 py-2 bg-surface border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-color"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            {videoUrl && (
              <div className="bg-surface rounded-lg p-4">
                <p className="text-sm text-text-secondary mb-2">Preview:</p>
                {extractYouTubeId(videoUrl) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(videoUrl)}`}
                    className="w-full aspect-video rounded-lg"
                    allowFullScreen
                    title="Video preview"
                  />
                ) : (
                  <p className="text-sm text-warning">Invalid or unsupported video URL</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="videoDescription" className="block text-sm font-medium text-text-secondary mb-2">
                Video Description (Optional)
              </label>
              <RichTextEditor
                initialContent={content}
                onChange={setContent}
                placeholder="Add any additional notes or context for this video..."
                minHeight="150px"
              />
            </div>
          </div>
        );

      case LessonType.PDF:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="pdfUrl" className="block text-sm font-medium text-text-secondary mb-2">
                PDF URL (S3 or external link)
              </label>
              <input
                id="pdfUrl"
                type="url"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                className="w-full px-4 py-2 bg-surface border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-color"
                placeholder="https://your-bucket.s3.amazonaws.com/file.pdf"
              />
              <p className="text-xs text-text-tertiary mt-1">
                Upload your PDF to S3 and paste the URL here. File upload UI coming soon.
              </p>
            </div>

            <div>
              <label htmlFor="pdfDescription" className="block text-sm font-medium text-text-secondary mb-2">
                PDF Description (Optional)
              </label>
              <RichTextEditor
                initialContent={content}
                onChange={setContent}
                placeholder="Add any additional notes about this PDF..."
                minHeight="150px"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-elevated rounded-lg border border-border-color w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-color">
          <h2 className="text-2xl font-bold text-text-primary">
            {lesson.id?.startsWith('temp-') ? 'Add Lesson' : 'Edit Lesson'}
          </h2>
          <button
            onClick={onCancel}
            className="text-text-tertiary hover:text-text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label htmlFor="lessonTitle" className="block text-sm font-medium text-text-secondary mb-2">
              Lesson Title
            </label>
            <input
              id="lessonTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 bg-surface border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-color"
              placeholder="Enter lesson title"
            />
          </div>

          <div>
            <label htmlFor="lessonType" className="block text-sm font-medium text-text-secondary mb-2">
              Lesson Type
            </label>
            <select
              id="lessonType"
              value={type}
              onChange={(e) => setType(e.target.value as LessonType)}
              disabled={!!lesson.id && !lesson.id.startsWith('temp-')}
              className="w-full px-4 py-2 bg-surface border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-color disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value={LessonType.TEXT}>Text Content</option>
              <option value={LessonType.VIDEO_EMBED}>Video (Embedded)</option>
              <option value={LessonType.PDF}>PDF Document</option>
            </select>
            {lesson.id && !lesson.id.startsWith('temp-') && (
              <p className="text-xs text-text-tertiary mt-1">
                Type cannot be changed after creation
              </p>
            )}
          </div>

          {renderTypeSpecificFields()}

          <div>
            <label htmlFor="dripDate" className="block text-sm font-medium text-text-secondary mb-2">
              Drip Release Date (Optional)
            </label>
            <input
              id="dripDate"
              type="date"
              value={dripDate}
              onChange={(e) => setDripDate(e.target.value)}
              className="w-full px-4 py-2 bg-surface border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-color"
            />
            <p className="text-xs text-text-tertiary mt-1">
              Leave empty for immediate availability. Set a future date to schedule release.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border-color">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-border-color text-text-secondary rounded-lg hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="px-6 py-2 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {lesson.id?.startsWith('temp-') ? 'Add Lesson' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
