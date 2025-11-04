'use client';

import React, { useState, useEffect } from 'react';
import {
  Edit,
  UserPlus,
  Palette,
  Calendar,
  Folder,
  Shield,
} from 'lucide-react';
import { TaskCard } from './TaskCard';
import { useRouter } from 'next/navigation';

interface Task {
  id: string;
  icon: typeof Edit;
  title: string;
  description: string;
  estimatedTime: string;
  actionLabel: string;
  actionRoute: string;
  isCompleted: boolean;
  autoDetect?: () => Promise<boolean>;
}

interface TaskChecklistProps {
  initialCompletedTasks?: string[];
  onProgressChange?: (completedTasks: number, totalTasks: number) => void;
}

export function TaskChecklist({
  initialCompletedTasks = [],
  onProgressChange,
}: TaskChecklistProps) {
  const router = useRouter();

  // Define all tasks
  const allTasks: Task[] = [
    {
      id: 'create-community',
      icon: Edit,
      title: 'Create your community',
      description: "You've successfully created your community. Great start!",
      estimatedTime: '',
      actionLabel: '',
      actionRoute: '',
      isCompleted: true, // Always completed if on this page
    },
    {
      id: 'configure-settings',
      icon: Shield,
      title: 'Configure basic settings',
      description: 'Your community settings are all set up and ready to go.',
      estimatedTime: '',
      actionLabel: '',
      actionRoute: '',
      isCompleted: true, // Always completed if on this page
    },
    {
      id: 'create-post',
      icon: Edit,
      title: 'Create your first post',
      description:
        'Welcome your members with an introductory post. Share your vision and get the conversation started.',
      estimatedTime: '5 minutes',
      actionLabel: 'Create Post',
      actionRoute: '/forum',
      isCompleted: false,
    },
    {
      id: 'invite-members',
      icon: UserPlus,
      title: 'Invite your first members',
      description:
        'Build your community by inviting people who share your interests. You can invite via email or share your community link.',
      estimatedTime: '10 minutes',
      actionLabel: 'Invite Members',
      actionRoute: '/settings/members',
      isCompleted: false,
    },
    {
      id: 'customize-branding',
      icon: Palette,
      title: 'Customize your branding',
      description:
        'Make your community stand out by adding your logo, choosing colors, and customizing the look and feel.',
      estimatedTime: '15 minutes',
      actionLabel: 'Customize Branding',
      actionRoute: '/settings/branding',
      isCompleted: false,
    },
    {
      id: 'schedule-event',
      icon: Calendar,
      title: 'Schedule your first event',
      description:
        'Engage your members by creating events. Host meetups, workshops, webinars, or casual hangouts.',
      estimatedTime: '10 minutes',
      actionLabel: 'Create Event',
      actionRoute: '/events/new',
      isCompleted: false,
    },
    {
      id: 'add-resources',
      icon: Folder,
      title: 'Add resources',
      description:
        'Create a resource library with helpful guides, documents, links, and materials for your members.',
      estimatedTime: '15 minutes',
      actionLabel: 'Add Resources',
      actionRoute: '/resources/new',
      isCompleted: false,
    },
    {
      id: 'setup-roles',
      icon: Shield,
      title: 'Set up member roles',
      description:
        'Define different roles and permissions for your community members, moderators, and admins.',
      estimatedTime: '10 minutes',
      actionLabel: 'Configure Roles',
      actionRoute: '/settings/roles',
      isCompleted: false,
    },
  ];

  // Initialize task completion state
  const [tasks, setTasks] = useState<Task[]>(() => {
    return allTasks.map((task) => ({
      ...task,
      isCompleted:
        task.isCompleted || initialCompletedTasks.includes(task.id),
    }));
  });

  // Calculate completed tasks and notify parent
  useEffect(() => {
    const completedCount = tasks.filter((task) => task.isCompleted).length;
    if (onProgressChange) {
      onProgressChange(completedCount, tasks.length);
    }
  }, [tasks, onProgressChange]);

  // Handle task action
  const handleTaskAction = async (taskId: string, route: string) => {
    // Save current progress
    const completedTaskIds = tasks
      .filter((t) => t.isCompleted)
      .map((t) => t.id);
    localStorage.setItem(
      'onboarding-progress',
      JSON.stringify(completedTaskIds)
    );

    // Navigate to the action route
    router.push(route);
  };

  // Auto-detect task completion (placeholder for future implementation)
  useEffect(() => {
    const checkTaskCompletion = async () => {
      // This would integrate with your backend to check actual completion status
      // For now, we rely on localStorage and manual updates
      const savedProgress = localStorage.getItem('onboarding-progress');
      if (savedProgress) {
        const completedTaskIds = JSON.parse(savedProgress);
        setTasks((prevTasks) =>
          prevTasks.map((task) => ({
            ...task,
            isCompleted:
              task.isCompleted || completedTaskIds.includes(task.id),
          }))
        );
      }
    };

    checkTaskCompletion();
  }, []);

  // Confetti effect on task completion (simplified version)
  const showConfetti = () => {
    // You could integrate with a library like canvas-confetti here
    console.log('🎉 Task completed!');
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          icon={task.icon}
          title={task.title}
          description={task.description}
          status={task.isCompleted ? 'completed' : 'active'}
          estimatedTime={task.estimatedTime}
          actionLabel={task.actionLabel}
          onAction={
            task.actionRoute && !task.isCompleted
              ? () => handleTaskAction(task.id, task.actionRoute)
              : undefined
          }
        />
      ))}
    </div>
  );
}
