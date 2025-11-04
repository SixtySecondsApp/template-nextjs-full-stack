'use client';

import React from 'react';

interface ProgressOverviewCardProps {
  completedTasks: number;
  totalTasks: number;
}

export function ProgressOverviewCard({ completedTasks, totalTasks }: ProgressOverviewCardProps) {
  const percentage = Math.round((completedTasks / totalTasks) * 100);
  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="p-8 rounded-2xl border text-white relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderColor: 'transparent',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Decorative background element */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          transform: 'translate(30%, -30%)',
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        {/* Circular Progress */}
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="white"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.6s ease-in-out',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold">{percentage}%</div>
              <div className="text-sm opacity-90">Complete</div>
            </div>
          </div>
        </div>

        {/* Progress Text */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-3xl font-bold mb-2">
            {completedTasks} of {totalTasks} tasks completed
          </h3>
          <p className="text-lg opacity-90 mb-4">
            {percentage === 100
              ? "Congratulations! You've completed all tasks!"
              : percentage >= 75
              ? "You're almost there! Keep going!"
              : percentage >= 50
              ? "Great progress! You're halfway there!"
              : percentage >= 25
              ? "Nice start! Keep up the momentum!"
              : "Let's get started on your journey!"}
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
