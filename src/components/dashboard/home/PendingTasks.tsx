'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { getPendingTasks, updateTaskStatus } from '@/lib/api/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import type { PendingTaskDTO } from '@/application/dto/dashboard.dto';

export function PendingTasks() {
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['pending-tasks'],
    queryFn: getPendingTasks,
    refetchInterval: 60000, // Refetch every minute
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, completed }: { taskId: string; completed: boolean }) =>
      updateTaskStatus(taskId, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-tasks'] });
    },
  });

  const handleTaskToggle = (taskId: string, currentStatus: string) => {
    const completed = currentStatus !== 'completed';
    updateTaskMutation.mutate({ taskId, completed });
  };

  const getBorderColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'border-red-500';
      case 'high':
        return 'border-orange-500';
      case 'medium':
        return 'border-yellow-500';
      default:
        return 'border-blue-500';
    }
  };

  const pendingCount = tasks?.filter((t) => t.status === 'pending').length || 0;

  return (
    <div style={{
      background: 'var(--surface-elevated)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '24px'
    }}>
      <h3 className="text-lg font-bold flex items-center gap-2 mb-5">
        <AlertCircle className="h-5 w-5" />
        Pending Tasks ({pendingCount})
      </h3>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">Failed to load tasks.</p>
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      )}

      {tasks && tasks.length > 0 && (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg border-l-4 ${getBorderColor(
                task.urgency
              )}`}
            >
              <button
                onClick={() => handleTaskToggle(task.id, task.status)}
                disabled={updateTaskMutation.isPending}
                className="flex-shrink-0 hover:opacity-70 transition-opacity disabled:opacity-50"
                aria-label={
                  task.status === 'completed'
                    ? 'Mark as incomplete'
                    : 'Mark as complete'
                }
              >
                {task.status === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm ${
                    task.status === 'completed'
                      ? 'line-through text-muted-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {task.text}
                </div>
                {task.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {task.description}
                  </div>
                )}
              </div>
              {task.count && task.count > 1 && (
                <span className="flex-shrink-0 px-2 py-1 bg-primary/10 text-primary text-xs rounded font-semibold">
                  {task.count}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && (!tasks || tasks.length === 0) && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No pending tasks. Great job! 🎉
        </p>
      )}
    </div>
  );
}
