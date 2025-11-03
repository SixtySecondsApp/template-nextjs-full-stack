/**
 * Course Data Transfer Objects
 * Plain TypeScript interfaces for API communication
 * NO domain logic, NO Prisma types
 */

/**
 * Full Course DTO for API responses
 */
export interface CourseDto {
  id: string;
  communityId: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string; // Fetched from User
  isPublished: boolean;
  publishedAt: string | null; // ISO string
  lessonCount: number; // Fetched from Lesson count
  enrolledCount: number; // Fetched from Progress count
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

/**
 * Create Course DTO for API requests
 */
export interface CreateCourseDto {
  communityId: string;
  title: string;
  description: string;
  instructorId: string;
}

/**
 * Update Course DTO for API requests
 */
export interface UpdateCourseDto {
  title?: string;
  description?: string;
}
