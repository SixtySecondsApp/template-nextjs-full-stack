/**
 * Reorder Lessons Use Case
 * Batch updates lesson order
 * Verifies course ownership
 */

import {
  ILessonRepository,
  ICourseRepository,
} from "@/ports/repositories";
import { ReorderLessonsDto } from "@/application/dtos/lesson.dto";
import { LessonError } from "@/application/errors/lesson.errors";

export class ReorderLessonsUseCase {
  constructor(
    private lessonRepository: ILessonRepository,
    private courseRepository: ICourseRepository
  ) {}

  /**
   * Execute reorder lessons operation
   * @param courseId Course ID
   * @param requestingUserId User reordering lessons (must be instructor)
   * @param input ReorderLessonsDto with lesson IDs and new orders
   * @throws Error with LessonError enum values
   */
  async execute(
    courseId: string,
    requestingUserId: string,
    input: ReorderLessonsDto
  ): Promise<void> {
    try {
      // Verify course ownership
      const course = await this.courseRepository.findById(courseId);
      if (!course) {
        throw new Error(LessonError.COURSE_NOT_FOUND);
      }
      if (course.getInstructorId() !== requestingUserId) {
        throw new Error(LessonError.NOT_COURSE_INSTRUCTOR);
      }

      // Validate orders are positive integers
      for (const item of input.lessons) {
        if (item.order < 0 || !Number.isInteger(item.order)) {
          throw new Error(LessonError.INVALID_ORDER);
        }
      }

      // Batch update via repository
      await this.lessonRepository.reorder(input.lessons);
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
