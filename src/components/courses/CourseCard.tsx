'use client';

import Link from 'next/link';
import { BookOpen, Users, Clock, CheckCircle2, Play } from 'lucide-react';
import { CourseDto } from '@/application/dtos/course.dto';
import { ProgressDto } from '@/application/dtos/progress.dto';

interface CourseCardProps {
  course: CourseDto;
  progress?: ProgressDto | null;
  onClick?: () => void;
}

export function CourseCard({ course, progress, onClick }: CourseCardProps) {
  const isEnrolled = !!progress;
  const isCompleted = progress?.completionPercentage === 100;
  const inProgress = progress && progress.completionPercentage > 0 && progress.completionPercentage < 100;

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
          <CheckCircle2 size={14} />
          Completed
        </span>
      );
    }
    if (inProgress) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-color/10 text-primary-color rounded-full text-xs font-medium">
          <Play size={14} />
          {progress.completionPercentage}% Complete
        </span>
      );
    }
    return null;
  };

  const getActionButton = () => {
    if (isCompleted) {
      return (
        <span className="px-6 py-2 bg-success text-white rounded-lg font-medium">
          Review Course
        </span>
      );
    }
    if (inProgress) {
      return (
        <span className="px-6 py-2 bg-primary-color text-white rounded-lg font-medium">
          Continue Learning
        </span>
      );
    }
    return (
      <span className="px-6 py-2 bg-primary-color text-white rounded-lg font-medium hover:bg-primary-color/90 transition-colors">
        Start Course
      </span>
    );
  };

  return (
    <Link
      href={`/courses/${course.id}`}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className="block bg-surface-elevated rounded-lg border border-border-color hover:border-primary-color/50 hover:shadow-lg transition-all duration-200 overflow-hidden group"
    >
      {/* Course Header with Status Badge */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-xl font-bold text-text-primary group-hover:text-primary-color transition-colors line-clamp-2">
            {course.title}
          </h3>
          {getStatusBadge()}
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary line-clamp-3 mb-4">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center gap-2 text-sm text-text-tertiary mb-4">
          <div className="w-6 h-6 rounded-full bg-primary-color/10 flex items-center justify-center text-primary-color text-xs font-medium">
            {course.instructorName.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-text-secondary">
            {course.instructorName}
          </span>
        </div>

        {/* Progress Bar (if enrolled) */}
        {inProgress && progress && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-text-tertiary mb-1.5">
              <span>Progress</span>
              <span>{progress.completionPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-color transition-all duration-300"
                style={{ width: `${progress.completionPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Course Footer with Metrics */}
      <div className="px-6 py-4 bg-surface border-t border-border-color flex items-center justify-between">
        <div className="flex items-center gap-5 text-sm text-text-tertiary">
          {/* Lesson Count */}
          <div className="flex items-center gap-2">
            <BookOpen size={16} />
            <span>{course.lessonCount} lessons</span>
          </div>

          {/* Enrolled Count */}
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>{course.enrolledCount} enrolled</span>
          </div>
        </div>

        {/* Action Button */}
        <div>
          {getActionButton()}
        </div>
      </div>
    </Link>
  );
}
