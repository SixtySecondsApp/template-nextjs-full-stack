/**
 * CourseProgress domain types
 * Type definitions for CourseProgress entity following hexagonal architecture
 */

export interface CreateProgressInput {
  id: string;
  courseId: string;
  userId: string;
}

export interface ProgressData {
  id: string;
  courseId: string;
  userId: string;
  completedLessonIds: string[];
  lastAccessedLessonId: string | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
