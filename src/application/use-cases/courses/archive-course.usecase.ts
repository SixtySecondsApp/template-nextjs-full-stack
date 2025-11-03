/**
 * Archive Course Use Case
 * Archives (soft deletes) a course
 * Verifies course is not published and instructor owns it
 */

import { ICourseRepository } from "@/ports/repositories";
import { CourseError } from "@/application/errors/course.errors";

export class ArchiveCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  /**
   * Execute archive course operation
   * @param courseId Course ID
   * @param instructorId Requesting user ID (must be instructor)
   * @throws Error with CourseError enum values
   */
  async execute(courseId: string, instructorId: string): Promise<void> {
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

      // Verify not published
      if (course.getIsPublished()) {
        throw new Error(CourseError.CANNOT_ARCHIVE_PUBLISHED_COURSE);
      }

      // Archive via repository
      await this.courseRepository.archive(courseId);
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
