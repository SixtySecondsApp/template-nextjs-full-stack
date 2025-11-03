'use client';

import { Download, PlayCircle } from 'lucide-react';
import { ProgressDto } from '@/application/dtos/progress.dto';

interface ProgressTrackerProps {
  progress: ProgressDto;
  totalLessons: number;
  courseId: string;
  onContinue?: () => void;
}

export function ProgressTracker({
  progress,
  totalLessons,
  courseId,
  onContinue
}: ProgressTrackerProps) {
  const percentage = progress.completionPercentage;
  const completedCount = progress.completedLessonIds.length;
  const isComplete = percentage === 100;

  // Calculate circle progress (SVG circle has circumference of ~283)
  const circumference = 283;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleDownloadCertificate = async () => {
    try {
      const response = await fetch(`/api/certificates/${courseId}/download`);
      if (!response.ok) throw new Error('Failed to download certificate');

      // Trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${courseId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate. Please try again.');
    }
  };

  return (
    <div className="bg-surface-elevated rounded-lg border border-border-color p-6">
      {/* Circular Progress Indicator */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-border-color"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`transition-all duration-500 ${
                isComplete ? 'text-success' : 'text-primary-color'
              }`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-text-primary">{percentage}%</span>
          </div>
        </div>

        <p className="text-sm text-text-secondary mt-4 text-center">
          {completedCount} of {totalLessons} lessons completed
        </p>

        {isComplete && (
          <div className="mt-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-success/10 text-success rounded-full text-sm font-medium">
              🎉 Course Complete!
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {progress.lastAccessedLessonId && !isComplete && (
          <button
            onClick={onContinue}
            className="w-full px-6 py-3 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <PlayCircle size={20} />
            Continue where you left off
          </button>
        )}

        {isComplete && progress.completedAt && (
          <button
            onClick={handleDownloadCertificate}
            className="w-full px-6 py-3 bg-success text-white rounded-lg hover:bg-success/90 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Download size={20} />
            Download Certificate
          </button>
        )}
      </div>

      {/* Progress Stats */}
      <div className="mt-6 pt-6 border-t border-border-color space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Started</span>
          <span className="text-text-primary font-medium">
            {new Date(progress.createdAt).toLocaleDateString()}
          </span>
        </div>

        {progress.lastAccessedAt && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Last accessed</span>
            <span className="text-text-primary font-medium">
              {new Date(progress.lastAccessedAt).toLocaleDateString()}
            </span>
          </div>
        )}

        {progress.completedAt && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Completed</span>
            <span className="text-success font-medium">
              {new Date(progress.completedAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
