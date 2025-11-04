'use client';

import React from 'react';
import { CheckCircle, LucideIcon } from 'lucide-react';

type TaskStatus = 'completed' | 'active' | 'incomplete';

interface TaskCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  status: TaskStatus;
  estimatedTime?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function TaskCard({
  icon: Icon,
  title,
  description,
  status,
  estimatedTime,
  actionLabel,
  onAction,
}: TaskCardProps) {
  const isCompleted = status === 'completed';
  const isActive = status === 'active';

  return (
    <div
      className="p-6 rounded-xl border transition-all duration-300"
      style={{
        background: isCompleted
          ? 'rgba(16, 185, 129, 0.05)'
          : 'var(--surface-elevated)',
        borderColor: isCompleted
          ? '#10b981'
          : isActive
          ? 'var(--primary-color)'
          : 'var(--border)',
        borderWidth: isCompleted || isActive ? '2px' : '1px',
        boxShadow: 'var(--shadow-sm)',
        transform: 'translateY(0)',
      }}
      onMouseEnter={(e) => {
        if (!isCompleted) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{
            background: isCompleted
              ? 'rgba(16, 185, 129, 0.1)'
              : isActive
              ? 'rgba(99, 102, 241, 0.1)'
              : 'rgba(156, 163, 175, 0.1)',
            color: isCompleted
              ? '#10b981'
              : isActive
              ? 'var(--primary-color)'
              : 'var(--text-tertiary)',
          }}
        >
          {isCompleted ? <CheckCircle size={24} /> : <Icon size={24} />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3
              className="text-lg font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </h3>

            {/* Status Badge */}
            <span
              className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap"
              style={{
                background: isCompleted
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'rgba(156, 163, 175, 0.1)',
                color: isCompleted ? '#10b981' : 'var(--text-tertiary)',
              }}
            >
              {isCompleted ? 'Completed' : 'Not Started'}
            </span>
          </div>

          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: 'var(--text-secondary)' }}
          >
            {description}
          </p>

          {/* Action Area */}
          <div className="flex items-center justify-between gap-4">
            {estimatedTime && !isCompleted && (
              <span
                className="text-xs font-medium"
                style={{ color: 'var(--text-tertiary)' }}
              >
                ⏱️ {estimatedTime}
              </span>
            )}

            {!isCompleted && actionLabel && onAction && (
              <button
                onClick={onAction}
                className="px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-md ml-auto"
                style={{
                  background: 'var(--primary-color)',
                  color: 'white',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary-hover)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--primary-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {actionLabel} →
              </button>
            )}

            {isCompleted && (
              <div className="ml-auto flex items-center gap-2">
                <CheckCircle
                  size={16}
                  style={{ color: '#10b981' }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: '#10b981' }}
                >
                  Task completed!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
