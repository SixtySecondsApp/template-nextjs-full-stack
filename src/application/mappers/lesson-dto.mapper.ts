/**
 * Lesson DTO Mapper
 * Converts between Domain Lesson entities and LessonDto
 * Maintains strict boundary between application and domain layers
 * 
 * Note: This assumes Lesson domain entity exists with proper getters
 * TODO: Update when Lesson entity is implemented
 */

import { LessonDto, LessonType } from "@/application/dtos/lesson.dto";

export class LessonDtoMapper {
  /**
   * Convert Lesson domain entity to LessonDto
   * @param lesson Domain Lesson entity
   * @returns LessonDto for API responses
   */
  static toDto(lesson: any): LessonDto {
    const dripAvailableAt = lesson.getDripAvailableAt();
    const isAvailable =
      !dripAvailableAt || new Date(dripAvailableAt) <= new Date();

    return {
      id: lesson.getId(),
      courseId: lesson.getCourseId(),
      title: lesson.getTitle(),
      content: lesson.getContent(),
      type: lesson.getType() as LessonType,
      videoUrl: lesson.getVideoUrl(),
      pdfUrl: lesson.getPdfUrl(),
      order: lesson.getOrder(),
      dripAvailableAt: dripAvailableAt?.toISOString() ?? null,
      isAvailable,
      createdAt: lesson.getCreatedAt().toISOString(),
      updatedAt: lesson.getUpdatedAt().toISOString(),
    };
  }

  /**
   * Convert array of Lesson entities to array of LessonDtos
   * @param lessons Array of domain Lesson entities
   * @returns Array of LessonDto for API responses
   */
  static toDtoArray(lessons: any[]): LessonDto[] {
    return lessons.map((lesson) => this.toDto(lesson));
  }
}
