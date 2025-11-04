'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SetupProgressDTO } from '@/application/dto/dashboard.dto';

interface WelcomeBannerProps {
  setupProgress: SetupProgressDTO;
  communityName: string;
}

const DISMISSED_KEY = 'dashboard-welcome-banner-dismissed';

export function WelcomeBanner({
  setupProgress,
  communityName,
}: WelcomeBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check localStorage for dismissed state
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed === 'true' || setupProgress.isDismissed) {
      setIsDismissed(true);
    }
  }, [setupProgress.isDismissed]);

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setIsDismissed(true);
  };

  if (isDismissed || setupProgress.isComplete) {
    return null;
  }

  return (
    <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Dismiss welcome banner"
      >
        <X className="h-5 w-5" />
      </button>

      <h2 className="text-xl font-bold mb-3">
        👋 Welcome to {communityName}!
      </h2>
      <p className="mb-4 text-white/90">
        Let's get your community set up in {setupProgress.totalSteps} steps:
      </p>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${setupProgress.percentageComplete}%` }}
            />
          </div>
          <span className="text-sm font-semibold">
            {setupProgress.percentageComplete}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {setupProgress.steps
          .sort((a, b) => a.order - b.order)
          .map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-2 text-sm ${
                step.isCompleted ? 'opacity-100' : 'opacity-70'
              }`}
            >
              {step.isCompleted ? (
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              ) : (
                <Circle className="h-4 w-4 flex-shrink-0" />
              )}
              <span>{step.label}</span>
            </div>
          ))}
      </div>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          className="bg-white text-indigo-600 hover:bg-white/90"
          onClick={() => {
            const firstIncomplete = setupProgress.steps.find(
              (s) => !s.isCompleted
            );
            if (firstIncomplete?.actionUrl) {
              window.location.href = firstIncomplete.actionUrl;
            }
          }}
        >
          Continue Setup →
        </Button>
        <Button
          variant="ghost"
          className="border border-white/30 text-white hover:bg-white/10"
          onClick={handleDismiss}
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
}
