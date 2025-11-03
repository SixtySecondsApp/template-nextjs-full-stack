/**
 * Course domain types
 * Type definitions for Course entity following hexagonal architecture
 */

export interface CreateCourseInput {
  id: string;
  communityId: string;
  title: string;
  description: string;
  instructorId: string;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
}

export interface CourseData {
  id: string;
  communityId: string;
  title: string;
  description: string;
  instructorId: string;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
