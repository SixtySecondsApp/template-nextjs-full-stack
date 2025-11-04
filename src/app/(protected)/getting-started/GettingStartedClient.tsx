'use client';

import React, { useState, useEffect } from 'react';
import { ProgressOverviewCard } from '@/components/onboarding/ProgressOverviewCard';
import { TaskChecklist } from '@/components/onboarding/TaskChecklist';

export function GettingStartedClient() {
  const [completedTasks, setCompletedTasks] = useState(2); // First 2 tasks always completed
  const [totalTasks] = useState(8);

  const handleProgressChange = (completed: number, total: number) => {
    setCompletedTasks(completed);
  };

  return (
    <>
      <ProgressOverviewCard
        completedTasks={completedTasks}
        totalTasks={totalTasks}
      />

      <div className="mb-16 mt-12">
        <h2
          className="text-3xl font-bold mb-8"
          style={{ color: 'var(--text-primary)' }}
        >
          Essential Tasks
        </h2>
        <TaskChecklist onProgressChange={handleProgressChange} />
      </div>
    </>
  );
}
