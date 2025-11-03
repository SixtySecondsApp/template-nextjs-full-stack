/**
 * List Lessons Use Case
 * Lists all lessons for a course
 * Ordered by order ASC
 * Optionally filters by drip availability
 */

import { ILessonRepository } from "@/ports/repositories";
import { LessonDto } from "@/application/dtos/lesson.dto";
import { LessonDtoMapper } from "@/application/mappers/lesson-dto.mapper";
import { LessonError } from "@/application/errors/lesson.errors";

export class ListLessonsUseCase {
  constructor(private lessonRepository: ILessonRepository) {}

  /**
   * Execute list lessons operation
   * @param courseId Course ID
   * @param availableOnly Optional flag to show only available lessons
   * @returns Array of LessonDto ordered by order ASC
   */
  async execute(
    courseId: string,
    availableOnly: boolean = false
  ): Promise<LessonDto[]> {
    try {
      // Find all lessons for course (ordered by order ASC in repository)
      const lessons = await this.lessonRepository.findByCourseId(courseId);

      // Filter available lessons if requested
      const filteredLessons = availableOnly
        ? lessons.filter((lesson) => {
            const dripDate = lesson.getDripAvailableAt();
            return !dripDate || new Date(dripDate) <= new Date();
          })
        : lessons;

      // Return DTOs
      return LessonDtoMapper.toDtoArray(filteredLessons);
    } catch (error) {
      throw new Error(LessonError.INTERNAL_SERVER_ERROR);
    }
  }
}
