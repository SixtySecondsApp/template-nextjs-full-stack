'use client';

import { CheckCircle2, Circle, Lock, PlayCircle, FileText, File } from 'lucide-react';
import { LessonDto, LessonType } from '@/application/dtos/lesson.dto';

interface CourseOutlineProps {
  lessons: LessonDto[];
  currentLessonId: string | null;
  completedLessonIds: string[];
  onLessonSelect: (lessonId: string) => void;
}

export function CourseOutline({
  lessons,
  currentLessonId,
  completedLessonIds,
  onLessonSelect
}: CourseOutlineProps) {
  const getLessonIcon = (type: LessonType, isCompleted: boolean, isAvailable: boolean) => {
    if (!isAvailable) {
      return <Lock size={16} className="text-text-tertiary" />;
    }
    if (isCompleted) {
      return <CheckCircle2 size={16} className="text-success" />;
    }

    switch (type) {
      case LessonType.VIDEO_EMBED:
        return <PlayCircle size={16} className="text-text-secondary" />;
      case LessonType.PDF:
        return <File size={16} className="text-text-secondary" />;
      case LessonType.TEXT:
      default:
        return <FileText size={16} className="text-text-secondary" />;
    }
  };

  return (
    <nav className="bg-surface-elevated rounded-lg border border-border-color p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold text-text-primary mb-4">Course Outline</h2>

      <div className="space-y-2">
        {lessons.map((lesson, index) => {
          const isCompleted = completedLessonIds.includes(lesson.id);
          const isCurrent = lesson.id === currentLessonId;
          const isAvailable = lesson.isAvailable;

          return (
            <button
              key={lesson.id}
              onClick={() => isAvailable && onLessonSelect(lesson.id)}
              disabled={!isAvailable}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                isCurrent
                  ? 'bg-primary-color/10 border-2 border-primary-color'
                  : 'border-2 border-transparent hover:bg-surface'
              } ${
                !isAvailable
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getLessonIcon(lesson.type, isCompleted, isAvailable)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-sm font-medium ${
                      isCurrent ? 'text-primary-color' : 'text-text-primary'
                    }`}>
                      {index + 1}. {lesson.title}
                    </span>
                  </div>

                  {!isAvailable && lesson.dripAvailableAt && (
                    <p className="text-xs text-warning mt-1">
                      Available {new Date(lesson.dripAvailableAt).toLocaleDateString()}
                    </p>
                  )}

                  {isCompleted && (
                    <p className="text-xs text-success mt-1 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Completed
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {lessons.length === 0 && (
        <p className="text-sm text-text-tertiary text-center py-8">
          No lessons available yet
        </p>
      )}
    </nav>
  );
}
