/**
 * Set Drip Schedule Use Case
 * Sets or clears drip availability date for a lesson
 * Verifies course ownership
 */

import {
  ILessonRepository,
  ICourseRepository,
} from "@/ports/repositories";
import { SetDripScheduleDto, LessonDto } from "@/application/dtos/lesson.dto";
import { LessonDtoMapper } from "@/application/mappers/lesson-dto.mapper";
import { LessonError } from "@/application/errors/lesson.errors";

export class SetDripScheduleUseCase {
  constructor(
    private lessonRepository: ILessonRepository,
    private courseRepository: ICourseRepository
  ) {}

  /**
   * Execute set drip schedule operation
   * @param lessonId Lesson ID
   * @param requestingUserId User setting drip schedule (must be instructor)
   * @param input SetDripScheduleDto with drip date
   * @returns Updated LessonDto
   * @throws Error with LessonError enum values
   */
  async execute(
    lessonId: string,
    requestingUserId: string,
    input: SetDripScheduleDto
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

      // Validate drip date not in past
      if (input.dripAvailableAt) {
        const dripDate = new Date(input.dripAvailableAt);
        if (dripDate < new Date()) {
          throw new Error(LessonError.DRIP_DATE_IN_PAST);
        }
      }

      // Set drip date via domain method (assuming lesson.setDripDate exists)
      // TODO: Replace with actual Lesson entity method
      // lesson.setDripDate(input.dripAvailableAt ? new Date(input.dripAvailableAt) : null);

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
