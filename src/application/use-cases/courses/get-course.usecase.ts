/**
 * Get Course Use Case
 * Retrieves a single course by ID
 * Includes instructor name, lesson count, and enrolled count
 */

import {
  ICourseRepository,
  IUserRepository,
  ILessonRepository,
  ICourseProgressRepository,
} from "@/ports/repositories";
import { CourseDto } from "@/application/dtos/course.dto";
import { CourseDtoMapper } from "@/application/mappers/course-dto.mapper";
import { CourseError } from "@/application/errors/course.errors";

export class GetCourseUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository,
    private lessonRepository: ILessonRepository,
    private progressRepository: ICourseProgressRepository
  ) {}

  /**
   * Execute get course operation
   * @param courseId Course ID
   * @returns CourseDto with metadata
   * @throws Error with CourseError.COURSE_NOT_FOUND
   */
  async execute(courseId: string): Promise<CourseDto> {
    try {
      // Find course
      const course = await this.courseRepository.findById(courseId);
      if (!course) {
        throw new Error(CourseError.COURSE_NOT_FOUND);
      }

      // Fetch instructor
      const instructor = await this.userRepository.findById(
        course.getInstructorId()
      );
      const instructorName = instructor?.getName() || "Unknown";

      // Fetch lesson count
      const lessons = await this.lessonRepository.findByCourseId(courseId);
      const lessonCount = lessons.length;

      // Fetch enrolled count
      const progresses = await this.progressRepository.findByCourseId(courseId);
      const enrolledCount = progresses.length;

      // Return DTO
      return CourseDtoMapper.toDto(
        course,
        instructorName,
        lessonCount,
        enrolledCount
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === CourseError.COURSE_NOT_FOUND) {
          throw error;
        }
      }
      throw new Error(CourseError.INTERNAL_SERVER_ERROR);
    }
  }
}
