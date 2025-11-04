'use client';

import { Check } from 'lucide-react';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function WizardProgress({ currentStep, totalSteps, steps }: WizardProgressProps) {
  return (
    <div
      className="flex px-10 py-8"
      style={{
        background: 'var(--surface-2)',
        borderBottom: '1px solid var(--border)'
      }}
    >
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div
            key={stepNumber}
            className="flex flex-col items-center flex-1 relative"
          >
            {/* Connecting line */}
            {index < totalSteps - 1 && (
              <div
                className="absolute top-5 left-1/2 w-full h-0.5 z-0"
                style={{
                  background: isCompleted ? 'var(--primary)' : 'var(--border)',
                }}
              />
            )}

            {/* Step circle */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-semibold relative z-10 mb-2 transition-all"
              style={{
                background: isCompleted ? 'var(--primary)' : 'var(--surface)',
                border: `${isActive ? '3px' : '2px'} solid ${
                  isCompleted
                    ? 'var(--primary)'
                    : isActive
                    ? 'var(--primary)'
                    : 'var(--border)'
                }`,
                color: isCompleted
                  ? '#ffffff'
                  : isActive
                  ? 'var(--primary)'
                  : 'var(--text-tertiary)',
              }}
            >
              {isCompleted ? (
                <Check size={16} strokeWidth={3} />
              ) : (
                stepNumber
              )}
            </div>

            {/* Step label */}
            <div
              className="text-sm font-medium text-center"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
