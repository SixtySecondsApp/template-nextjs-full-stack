/**
 * CourseProgress DTO Mapper
 * Converts between Domain CourseProgress entities and ProgressDto
 * Maintains strict boundary between application and domain layers
 * 
 * Note: This assumes CourseProgress domain entity exists with proper getters
 * TODO: Update when CourseProgress entity is implemented
 */

import { ProgressDto } from "@/application/dtos/progress.dto";

export class ProgressDtoMapper {
  /**
   * Convert CourseProgress domain entity to ProgressDto
   * @param progress Domain CourseProgress entity
   * @returns ProgressDto for API responses
   */
  static toDto(progress: any): ProgressDto {
    return {
      id: progress.getId(),
      courseId: progress.getCourseId(),
      userId: progress.getUserId(),
      completedLessonIds: progress.getCompletedLessonIds(),
      lastAccessedLessonId: progress.getLastAccessedLessonId(),
      completionPercentage: progress.getCompletionPercentage(),
      completedAt: progress.getCompletedAt()?.toISOString() ?? null,
      createdAt: progress.getCreatedAt().toISOString(),
      updatedAt: progress.getUpdatedAt().toISOString(),
    };
  }

  /**
   * Convert array of CourseProgress entities to array of ProgressDtos
   * @param progresses Array of domain CourseProgress entities
   * @returns Array of ProgressDto for API responses
   */
  static toDtoArray(progresses: any[]): ProgressDto[] {
    return progresses.map((progress) => this.toDto(progress));
  }
}
