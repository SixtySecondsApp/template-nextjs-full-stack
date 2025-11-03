/**
 * Update Lesson Use Case
 * Updates lesson properties
 * Verifies course ownership
 */

import {
  ILessonRepository,
  ICourseRepository,
} from "@/ports/repositories";
import { UpdateLessonDto, LessonDto } from "@/application/dtos/lesson.dto";
import { LessonDtoMapper } from "@/application/mappers/lesson-dto.mapper";
import { LessonError } from "@/application/errors/lesson.errors";

export class UpdateLessonUseCase {
  constructor(
    private lessonRepository: ILessonRepository,
    private courseRepository: ICourseRepository
  ) {}

  /**
   * Execute update lesson operation
   * @param lessonId Lesson ID
   * @param requestingUserId User updating the lesson (must be instructor)
   * @param input UpdateLessonDto with optional fields
   * @returns Updated LessonDto
   * @throws Error with LessonError enum values
   */
  async execute(
    lessonId: string,
    requestingUserId: string,
    input: UpdateLessonDto
  ): Promise<LessonDto> {
    try {
      // Find lesson
      const lesson = await this.lessonRepository.findById(lessonId);
      if (!lesson) {
        throw new Error(LessonError.LESSON_NOT_FOUND);
      }

      // Verify course ownership
      const course = await this.courseRepository.findById(
        lesson.getCourseId()
      );
      if (!course) {
        throw new Error(LessonError.COURSE_NOT_FOUND);
      }
      if (course.getInstructorId() !== requestingUserId) {
        throw new Error(LessonError.NOT_COURSE_INSTRUCTOR);
      }

      // Validate input
      if (input.title !== undefined) {
        if (!input.title || input.title.trim().length === 0) {
          throw new Error(LessonError.INVALID_TITLE);
        }
      }
      if (input.content !== undefined) {
        if (!input.content || input.content.trim().length === 0) {
          throw new Error(LessonError.INVALID_CONTENT);
        }
      }
      if (
        input.type !== undefined &&
        !["TEXT", "VIDEO_EMBED", "PDF"].includes(input.type)
      ) {
        throw new Error(LessonError.INVALID_TYPE);
      }

      // Update via domain method (assuming lesson.update exists)
      // TODO: Replace with actual Lesson entity method
      // lesson.update(input);

      // Persist via repository
      const updated = await this.lessonRepository.update(lesson);

      // Return DTO
      return LessonDtoMapper.toDto(updated);
    } catch (error) {
      if (error instanceof Error) {
        if (Object.values(LessonError).includes(error.message as LessonError)) {
          throw error;
        }
      }
      throw new Error(LessonError.INTERNAL_SERVER_ERROR);
    }
  }
}
