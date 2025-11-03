/**
 * List Courses Use Case
 * Lists all courses by community ID
 * Supports filtering: all, published only, archived
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

export class ListCoursesUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository,
    private lessonRepository: ILessonRepository,
    private progressRepository: ICourseProgressRepository
  ) {}

  /**
   * Execute list courses operation
   * @param communityId Community ID
   * @param publishedOnly Optional flag to show only published courses
   * @returns Array of CourseDto with metadata
   */
  async execute(
    communityId: string,
    publishedOnly: boolean = false
  ): Promise<CourseDto[]> {
    try {
      // Find all courses in community
      const allCourses = await this.courseRepository.findByCommunityId(
        communityId
      );

      // Filter published if requested
      const courses = publishedOnly
        ? allCourses.filter((c) => c.getIsPublished())
        : allCourses;

      // Build DTOs with metadata
      const courseDtos = await Promise.all(
        courses.map(async (course) => {
          const instructorId = course.getInstructorId();
          const instructor = await this.userRepository.findById(instructorId);
          const instructorName = instructor?.getName() || "Unknown";

          const lessons = await this.lessonRepository.findByCourseId(
            course.getId()
          );
          const lessonCount = lessons.length;

          const progresses = await this.progressRepository.findByCourseId(
            course.getId()
          );
          const enrolledCount = progresses.length;

          return CourseDtoMapper.toDto(
            course,
            instructorName,
            lessonCount,
            enrolledCount
          );
        })
      );

      return courseDtos;
    } catch (error) {
      throw new Error(CourseError.INTERNAL_SERVER_ERROR);
    }
  }
}
