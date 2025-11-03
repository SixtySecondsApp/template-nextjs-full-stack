/**
 * Lesson domain types
 * Type definitions for Lesson entity following hexagonal architecture
 */

export enum LessonType {
  TEXT = "TEXT",
  VIDEO_EMBED = "VIDEO_EMBED",
  PDF = "PDF",
}

export interface CreateLessonInput {
  id: string;
  courseId: string;
  sectionId: string | null;
  title: string;
  content: string;
  type: LessonType;
  videoUrl: string | null;
  pdfUrl: string | null;
  order: number;
}

export interface UpdateLessonInput {
  title?: string;
  content?: string;
  videoUrl?: string | null;
  pdfUrl?: string | null;
  order?: number;
}

export interface LessonData {
  id: string;
  courseId: string;
  sectionId: string | null;
  title: string;
  content: string;
  type: LessonType;
  videoUrl: string | null;
  pdfUrl: string | null;
  order: number;
  dripAvailableAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
