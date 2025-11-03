/**
 * Lesson Data Transfer Objects
 * Plain TypeScript interfaces for API communication
 * NO domain logic, NO Prisma types
 */

/**
 * Lesson types enum for API
 */
export enum LessonType {
  TEXT = "TEXT",
  VIDEO_EMBED = "VIDEO_EMBED",
  PDF = "PDF",
}

/**
 * Full Lesson DTO for API responses
 */
export interface LessonDto {
  id: string;
  courseId: string;
  title: string;
  content: string;
  type: LessonType;
  videoUrl: string | null;
  pdfUrl: string | null;
  order: number;
  dripAvailableAt: string | null; // ISO string
  isAvailable: boolean; // Computed from dripAvailableAt
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

/**
 * Create Lesson DTO for API requests
 */
export interface CreateLessonDto {
  courseId: string;
  title: string;
  content: string;
  type: LessonType;
  videoUrl?: string | null;
  pdfUrl?: string | null;
  order: number;
}

/**
 * Update Lesson DTO for API requests
 */
export interface UpdateLessonDto {
  title?: string;
  content?: string;
  type?: LessonType;
  videoUrl?: string | null;
  pdfUrl?: string | null;
  order?: number;
}

/**
 * Reorder Lessons DTO for API requests
 */
export interface ReorderLessonsDto {
  lessons: Array<{
    id: string;
    order: number;
  }>;
}

/**
 * Set Drip Schedule DTO for API requests
 */
export interface SetDripScheduleDto {
  dripAvailableAt: string | null; // ISO string
}
