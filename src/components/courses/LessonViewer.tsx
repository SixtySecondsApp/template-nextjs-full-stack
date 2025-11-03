'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { LessonDto, LessonType } from '@/application/dtos/lesson.dto';
import { ProgressDto } from '@/application/dtos/progress.dto';
import { CourseOutline } from './CourseOutline';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface LessonViewerProps {
  courseId: string;
  initialLessonId?: string;
  userId: string;
}

export function LessonViewer({ courseId, initialLessonId, userId }: LessonViewerProps) {
  const [lessons, setLessons] = useState<LessonDto[]>([]);
  const [currentLesson, setCurrentLesson] = useState<LessonDto | null>(null);
  const [progress, setProgress] = useState<ProgressDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);

  useEffect(() => {
    loadLessons();
    loadProgress();
  }, [courseId]);

  useEffect(() => {
    if (lessons.length > 0 && !currentLesson) {
      // Load initial lesson or continue from last accessed
      const lessonId = initialLessonId || progress?.lastAccessedLessonId || lessons[0]?.id;
      const lesson = lessons.find(l => l.id === lessonId);
      if (lesson) {
        setCurrentLesson(lesson);
      }
    }
  }, [lessons, progress, initialLessonId, currentLesson]);

  const loadLessons = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons`);
      if (!response.ok) throw new Error('Failed to load lessons');
      const data = await response.json();
      setLessons(data.sort((a: LessonDto, b: LessonDto) => a.order - b.order));
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const response = await fetch(`/api/progress/${courseId}`);
      if (!response.ok) {
        if (response.status === 404) {
          // No progress yet, that's ok
          return;
        }
        throw new Error('Failed to load progress');
      }
      const data = await response.json();
      setProgress(data);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleLessonSelect = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson && lesson.isAvailable) {
      setCurrentLesson(lesson);
      // Track access
      trackLessonAccess(lessonId);
    }
  };

  const trackLessonAccess = async (lessonId: string) => {
    try {
      await fetch(`/api/progress/${courseId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, userId })
      });
      loadProgress(); // Reload progress to update lastAccessedLessonId
    } catch (error) {
      console.error('Error tracking lesson access:', error);
    }
  };

  const handleMarkComplete = async () => {
    if (!currentLesson) return;

    setIsMarkingComplete(true);
    try {
      const response = await fetch(`/api/lessons/${currentLesson.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) throw new Error('Failed to mark lesson complete');

      // Reload progress to update completed lessons
      await loadProgress();

      // Auto-advance to next lesson if available
      const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
      const nextLesson = lessons[currentIndex + 1];
      if (nextLesson && nextLesson.isAvailable) {
        setTimeout(() => {
          setCurrentLesson(nextLesson);
          trackLessonAccess(nextLesson.id);
        }, 1000);
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      alert('Failed to mark lesson as complete. Please try again.');
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!currentLesson) return;

    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    const targetIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    const targetLesson = lessons[targetIndex];

    if (targetLesson && targetLesson.isAvailable) {
      setCurrentLesson(targetLesson);
      trackLessonAccess(targetLesson.id);
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const extractVimeoId = (url: string): string | null => {
    const regExp = /vimeo.*\/(\d+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const renderLessonContent = () => {
    if (!currentLesson) {
      return (
        <div className="flex items-center justify-center h-96 text-text-tertiary">
          Select a lesson to begin
        </div>
      );
    }

    switch (currentLesson.type) {
      case LessonType.TEXT:
        return (
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: currentLesson.content }}
          />
        );

      case LessonType.VIDEO_EMBED:
        const youtubeId = currentLesson.videoUrl ? extractYouTubeId(currentLesson.videoUrl) : null;
        const vimeoId = currentLesson.videoUrl ? extractVimeoId(currentLesson.videoUrl) : null;

        return (
          <div className="space-y-4">
            {youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                className="w-full aspect-video rounded-lg"
                allowFullScreen
                title={currentLesson.title}
              />
            ) : vimeoId ? (
              <iframe
                src={`https://player.vimeo.com/video/${vimeoId}`}
                className="w-full aspect-video rounded-lg"
                allowFullScreen
                title={currentLesson.title}
              />
            ) : (
              <div className="w-full aspect-video bg-surface rounded-lg flex items-center justify-center text-warning">
                Invalid video URL
              </div>
            )}

            {currentLesson.content && currentLesson.content !== '<p></p>' && (
              <div
                className="prose prose-sm dark:prose-invert max-w-none mt-6"
                dangerouslySetInnerHTML={{ __html: currentLesson.content }}
              />
            )}
          </div>
        );

      case LessonType.PDF:
        if (!currentLesson.pdfUrl) {
          return (
            <div className="flex items-center justify-center h-96 text-warning">
              PDF URL not available
            </div>
          );
        }

        return (
          <div className="space-y-4">
            <Document
              file={currentLesson.pdfUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              className="flex flex-col items-center"
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  className="mb-4 border border-border-color rounded-lg"
                  width={800}
                />
              ))}
            </Document>

            {currentLesson.content && currentLesson.content !== '<p></p>' && (
              <div
                className="prose prose-sm dark:prose-invert max-w-none mt-6"
                dangerouslySetInnerHTML={{ __html: currentLesson.content }}
              />
            )}
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96 text-text-tertiary">
            Unknown lesson type
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-text-secondary">Loading course...</div>
      </div>
    );
  }

  const currentIndex = lessons.findIndex(l => l.id === currentLesson?.id);
  const isCompleted = currentLesson && progress?.completedLessonIds.includes(currentLesson.id);
  const hasPrev = currentIndex > 0 && lessons[currentIndex - 1]?.isAvailable;
  const hasNext = currentIndex < lessons.length - 1 && lessons[currentIndex + 1]?.isAvailable;

  return (
    <div className="flex gap-6 h-full">
      {/* Sidebar - Course Outline */}
      <div className="w-80 flex-shrink-0 sticky top-6 self-start max-h-[calc(100vh-8rem)] overflow-y-auto">
        <CourseOutline
          lessons={lessons}
          currentLessonId={currentLesson?.id || null}
          completedLessonIds={progress?.completedLessonIds || []}
          onLessonSelect={handleLessonSelect}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="bg-surface-elevated rounded-lg border border-border-color p-8">
          {currentLesson && (
            <>
              {/* Lesson Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  {currentLesson.title}
                </h1>
                {isCompleted && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                    <CheckCircle size={16} />
                    Completed
                  </span>
                )}
              </div>

              {/* Lesson Content */}
              <div className="mb-8">
                {renderLessonContent()}
              </div>

              {/* Lesson Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-border-color">
                <button
                  onClick={() => handleNavigate('prev')}
                  disabled={!hasPrev}
                  className="flex items-center gap-2 px-6 py-3 border border-border-color rounded-lg text-text-secondary hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>

                {!isCompleted && (
                  <button
                    onClick={handleMarkComplete}
                    disabled={isMarkingComplete}
                    className="px-6 py-3 bg-success text-white rounded-lg hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <CheckCircle size={20} />
                    {isMarkingComplete ? 'Marking...' : 'Mark as Complete'}
                  </button>
                )}

                <button
                  onClick={() => handleNavigate('next')}
                  disabled={!hasNext}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
