/**
 * Update Course Use Case
 * Updates course title and/or description
 * Verifies instructor ownership
 */

import {
  ICourseRepository,
  IUserRepository,
  ILessonRepository,
  ICourseProgressRepository,
} from "@/ports/repositories";
import { UpdateCourseDto, CourseDto } from "@/application/dtos/course.dto";
import { CourseDtoMapper } from "@/application/mappers/course-dto.mapper";
import { CourseError } from "@/application/errors/course.errors";

export class UpdateCourseUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository,
    private lessonRepository: ILessonRepository,
    private progressRepository: ICourseProgressRepository
  ) {}

  /**
   * Execute update course operation
   * @param courseId Course ID
   * @param instructorId Requesting user ID (must be instructor)
   * @param input UpdateCourseDto with optional fields
   * @returns Updated CourseDto
   * @throws Error with CourseError enum values
   */
  async execute(
    courseId: string,
    instructorId: string,
    input: UpdateCourseDto
  ): Promise<CourseDto> {
    try {
      // Find course
      const course = await this.courseRepository.findById(courseId);
      if (!course) {
        throw new Error(CourseError.COURSE_NOT_FOUND);
      }

      // Verify ownership
      if (course.getInstructorId() !== instructorId) {
        throw new Error(CourseError.UNAUTHORIZED);
      }

      // Update via domain method (assuming course.update exists)
      // TODO: Replace with actual Course entity method
      if (input.title !== undefined) {
        if (!input.title || input.title.trim().length === 0) {
          throw new Error(CourseError.INVALID_TITLE);
        }
        // course.update({ title: input.title });
      }
      if (input.description !== undefined) {
        if (!input.description || input.description.trim().length === 0) {
          throw new Error(CourseError.INVALID_DESCRIPTION);
        }
        // course.update({ description: input.description });
      }

      // Persist via repository
      const updated = await this.courseRepository.update(course);

      // Fetch metadata for DTO
      const instructor = await this.userRepository.findById(instructorId);
      const instructorName = instructor?.getName() || "Unknown";

      const lessons = await this.lessonRepository.findByCourseId(courseId);
      const lessonCount = lessons.length;

      const progresses = await this.progressRepository.findByCourseId(courseId);
      const enrolledCount = progresses.length;

      // Return DTO
      return CourseDtoMapper.toDto(
        updated,
        instructorName,
        lessonCount,
        enrolledCount
      );
    } catch (error) {
      if (error instanceof Error) {
        if (Object.values(CourseError).includes(error.message as CourseError)) {
          throw error;
        }
      }
      throw new Error(CourseError.INTERNAL_SERVER_ERROR);
    }
  }
}
