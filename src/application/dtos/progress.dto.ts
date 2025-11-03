/**
 * CourseProgress Data Transfer Objects
 * Plain TypeScript interfaces for API communication
 * NO domain logic, NO Prisma types
 */

/**
 * Full CourseProgress DTO for API responses
 */
export interface ProgressDto {
  id: string;
  courseId: string;
  userId: string;
  completedLessonIds: string[];
  lastAccessedLessonId: string | null;
  completionPercentage: number;
  completedAt: string | null; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

/**
 * Track Progress DTO for API requests
 */
export interface TrackProgressDto {
  courseId: string;
  userId: string;
  lessonId: string;
}

/**
 * Mark Lesson Complete DTO for API requests
 */
export interface MarkCompleteDto {
  lessonId: string;
}
