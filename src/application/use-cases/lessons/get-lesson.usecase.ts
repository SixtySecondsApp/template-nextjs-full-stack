/**
 * Get Lesson Use Case
 * Retrieves a single lesson by ID
 */

import { ILessonRepository } from "@/ports/repositories";
import { LessonDto } from "@/application/dtos/lesson.dto";
import { LessonDtoMapper } from "@/application/mappers/lesson-dto.mapper";
import { LessonError } from "@/application/errors/lesson.errors";

export class GetLessonUseCase {
  constructor(private lessonRepository: ILessonRepository) {}

  /**
   * Execute get lesson operation
   * @param lessonId Lesson ID
   * @returns LessonDto
   * @throws Error with LessonError.LESSON_NOT_FOUND
   */
  async execute(lessonId: string): Promise<LessonDto> {
    try {
      // Find lesson
      const lesson = await this.lessonRepository.findById(lessonId);
      if (!lesson) {
        throw new Error(LessonError.LESSON_NOT_FOUND);
      }

      // Return DTO
      return LessonDtoMapper.toDto(lesson);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === LessonError.LESSON_NOT_FOUND) {
          throw error;
        }
      }
      throw new Error(LessonError.INTERNAL_SERVER_ERROR);
    }
  }
}
