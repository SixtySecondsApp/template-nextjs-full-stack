/**
 * Publish Course Use Case
 * Publishes a course, making it visible to students
 * Verifies instructor ownership
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

export class PublishCourseUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository,
    private lessonRepository: ILessonRepository,
    private progressRepository: ICourseProgressRepository
  ) {}

  /**
   * Execute publish course operation
   * @param courseId Course ID
   * @param instructorId Requesting user ID (must be instructor)
   * @returns Published CourseDto
   * @throws Error with CourseError enum values
   */
  async execute(courseId: string, instructorId: string): Promise<CourseDto> {
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

      // Check if already published
      if (course.getIsPublished()) {
        throw new Error(CourseError.COURSE_ALREADY_PUBLISHED);
      }

      // Publish via domain method (assuming course.publish exists)
      // TODO: Replace with actual Course entity method
      // course.publish();

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
