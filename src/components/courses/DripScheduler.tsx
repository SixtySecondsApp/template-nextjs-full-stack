'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Zap, Save } from 'lucide-react';
import { LessonDto } from '@/application/dtos/lesson.dto';

interface DripSchedulerProps {
  courseId: string;
  onScheduleUpdate?: () => void;
}

type ScheduleMode = 'manual' | 'weekly' | 'daily' | 'immediate';

export function DripScheduler({ courseId, onScheduleUpdate }: DripSchedulerProps) {
  const [lessons, setLessons] = useState<LessonDto[]>([]);
  const [dripSchedule, setDripSchedule] = useState<Map<string, Date | null>>(new Map());
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>('manual');
  const [startDate, setStartDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadLessons();
  }, [courseId]);

  const loadLessons = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons`);
      if (!response.ok) throw new Error('Failed to load lessons');
      const data = await response.json();
      const sortedLessons = data.sort((a: LessonDto, b: LessonDto) => a.order - b.order);
      setLessons(sortedLessons);

      // Initialize schedule map with existing drip dates
      const scheduleMap = new Map<string, Date | null>();
      sortedLessons.forEach((lesson: LessonDto) => {
        scheduleMap.set(
          lesson.id,
          lesson.dripAvailableAt ? new Date(lesson.dripAvailableAt) : null
        );
      });
      setDripSchedule(scheduleMap);
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualDateChange = (lessonId: string, dateString: string) => {
    const newSchedule = new Map(dripSchedule);
    newSchedule.set(lessonId, dateString ? new Date(dateString) : null);
    setDripSchedule(newSchedule);
  };

  const applyScheduleMode = () => {
    if (!startDate && scheduleMode !== 'immediate') {
      alert('Please select a start date');
      return;
    }

    const newSchedule = new Map<string, Date | null>();
    const baseDate = scheduleMode === 'immediate' ? new Date() : new Date(startDate);

    lessons.forEach((lesson, index) => {
      switch (scheduleMode) {
        case 'immediate':
          // Make all lessons available immediately
          newSchedule.set(lesson.id, null);
          break;

        case 'daily':
          // Release one lesson per day
          const dailyDate = new Date(baseDate);
          dailyDate.setDate(dailyDate.getDate() + index);
          newSchedule.set(lesson.id, dailyDate);
          break;

        case 'weekly':
          // Release one lesson per week
          const weeklyDate = new Date(baseDate);
          weeklyDate.setDate(weeklyDate.getDate() + (index * 7));
          newSchedule.set(lesson.id, weeklyDate);
          break;

        case 'manual':
          // Keep existing manual dates
          break;
      }
    });

    setDripSchedule(newSchedule);
  };

  const handleSaveSchedule = async () => {
    setIsSaving(true);
    try {
      // Update each lesson's drip date
      const updatePromises = lessons.map(async (lesson) => {
        const dripDate = dripSchedule.get(lesson.id);
        const response = await fetch(`/api/lessons/${lesson.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dripAvailableAt: dripDate ? dripDate.toISOString() : null
          })
        });

        if (!response.ok) throw new Error(`Failed to update lesson ${lesson.id}`);
        return response.json();
      });

      await Promise.all(updatePromises);

      alert('Drip schedule saved successfully!');
      if (onScheduleUpdate) onScheduleUpdate();

      // Reload to get updated data
      await loadLessons();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Failed to save schedule. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-text-tertiary">
        Loading lessons...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Drip Content Scheduler
        </h2>
        <p className="text-text-secondary">
          Control when lessons become available to students. Leave blank for immediate availability.
        </p>
      </div>

      {/* Schedule Mode Selector */}
      <div className="bg-surface-elevated rounded-lg border border-border-color p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Quick Schedule Options
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => setScheduleMode('manual')}
            className={`p-4 rounded-lg border-2 transition-all ${
              scheduleMode === 'manual'
                ? 'border-primary-color bg-primary-color/10'
                : 'border-border-color hover:border-primary-color/50'
            }`}
          >
            <Calendar className="w-6 h-6 mx-auto mb-2 text-primary-color" />
            <p className="font-medium text-text-primary">Manual</p>
            <p className="text-xs text-text-tertiary mt-1">Set each date individually</p>
          </button>

          <button
            onClick={() => setScheduleMode('immediate')}
            className={`p-4 rounded-lg border-2 transition-all ${
              scheduleMode === 'immediate'
                ? 'border-primary-color bg-primary-color/10'
                : 'border-border-color hover:border-primary-color/50'
            }`}
          >
            <Zap className="w-6 h-6 mx-auto mb-2 text-primary-color" />
            <p className="font-medium text-text-primary">Immediate</p>
            <p className="text-xs text-text-tertiary mt-1">Release all now</p>
          </button>

          <button
            onClick={() => setScheduleMode('daily')}
            className={`p-4 rounded-lg border-2 transition-all ${
              scheduleMode === 'daily'
                ? 'border-primary-color bg-primary-color/10'
                : 'border-border-color hover:border-primary-color/50'
            }`}
          >
            <Clock className="w-6 h-6 mx-auto mb-2 text-primary-color" />
            <p className="font-medium text-text-primary">Daily</p>
            <p className="text-xs text-text-tertiary mt-1">One lesson per day</p>
          </button>

          <button
            onClick={() => setScheduleMode('weekly')}
            className={`p-4 rounded-lg border-2 transition-all ${
              scheduleMode === 'weekly'
                ? 'border-primary-color bg-primary-color/10'
                : 'border-border-color hover:border-primary-color/50'
            }`}
          >
            <Calendar className="w-6 h-6 mx-auto mb-2 text-primary-color" />
            <p className="font-medium text-text-primary">Weekly</p>
            <p className="text-xs text-text-tertiary mt-1">One lesson per week</p>
          </button>
        </div>

        {scheduleMode !== 'manual' && scheduleMode !== 'immediate' && (
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label htmlFor="startDate" className="block text-sm font-medium text-text-secondary mb-2">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-surface border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-color"
              />
            </div>
            <button
              onClick={applyScheduleMode}
              disabled={!startDate}
              className="px-6 py-2 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Schedule
            </button>
          </div>
        )}

        {scheduleMode === 'immediate' && (
          <button
            onClick={applyScheduleMode}
            className="w-full px-6 py-3 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 transition-colors"
          >
            Release All Lessons Immediately
          </button>
        )}
      </div>

      {/* Lesson Schedule List */}
      <div className="bg-surface-elevated rounded-lg border border-border-color p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Lesson Availability Schedule
        </h3>

        <div className="space-y-3">
          {lessons.map((lesson, index) => {
            const dripDate = dripSchedule.get(lesson.id);
            const isAvailable = !dripDate || new Date(dripDate) <= new Date();

            return (
              <div
                key={lesson.id}
                className="flex items-center gap-4 p-4 bg-surface rounded-lg border border-border-color"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-color/10 flex items-center justify-center text-primary-color font-semibold">
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary truncate">
                    {lesson.title}
                  </p>
                  {isAvailable ? (
                    <p className="text-xs text-success mt-0.5">Available now</p>
                  ) : (
                    <p className="text-xs text-warning mt-0.5">
                      Scheduled for {dripDate?.toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={formatDateForInput(dripDate)}
                    onChange={(e) => handleManualDateChange(lesson.id, e.target.value)}
                    className="px-3 py-2 bg-surface border border-border-color rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-color"
                  />
                  {dripDate && (
                    <button
                      onClick={() => handleManualDateChange(lesson.id, '')}
                      className="px-3 py-2 text-sm text-text-secondary hover:text-primary-color transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        <button
          onClick={() => loadLessons()}
          disabled={isSaving}
          className="px-6 py-3 border border-border-color text-text-secondary rounded-lg hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset Changes
        </button>
        <button
          onClick={handleSaveSchedule}
          disabled={isSaving}
          className="px-6 py-3 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save size={20} />
          {isSaving ? 'Saving...' : 'Save Schedule'}
        </button>
      </div>
    </div>
  );
}
