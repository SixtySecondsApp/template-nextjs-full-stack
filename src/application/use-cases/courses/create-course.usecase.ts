/**
 * Create Course Use Case
 * Creates a new course in unpublished status
 * Orchestrates domain logic and repository operations
 */

import { ICourseRepository, IUserRepository } from "@/ports/repositories";
import { CreateCourseDto, CourseDto } from "@/application/dtos/course.dto";
import { CourseDtoMapper } from "@/application/mappers/course-dto.mapper";
import { CourseError } from "@/application/errors/course.errors";

export class CreateCourseUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Execute create course operation
   * Creates course in unpublished status (publishedAt = null)
   * @param input CreateCourseDto with required fields
   * @returns CourseDto with assigned ID and timestamps
   * @throws Error with CourseError enum values
   */
  async execute(input: CreateCourseDto): Promise<CourseDto> {
    try {
      // Validate input
      if (!input.title || input.title.trim().length === 0) {
        throw new Error(CourseError.INVALID_TITLE);
      }
      if (!input.description || input.description.trim().length === 0) {
        throw new Error(CourseError.INVALID_DESCRIPTION);
      }

      // Verify instructor exists
      const instructor = await this.userRepository.findById(input.instructorId);
      if (!instructor) {
        throw new Error(CourseError.INSTRUCTOR_NOT_FOUND);
      }

      // Create domain entity (assuming Course.create exists)
      // TODO: Replace with actual Course entity when implemented
      const course = {
        getId: () => crypto.randomUUID(),
        getCommunityId: () => input.communityId,
        getTitle: () => input.title,
        getDescription: () => input.description,
        getInstructorId: () => input.instructorId,
        getIsPublished: () => false,
        getPublishedAt: () => null,
        getCreatedAt: () => new Date(),
        getUpdatedAt: () => new Date(),
      };

      // Persist via repository
      const created = await this.courseRepository.create(course);

      // Fetch instructor name for DTO
      const instructorName = instructor.getName() || "Unknown";

      // Return DTO with counts (new course has 0 lessons, 0 enrolled)
      return CourseDtoMapper.toDto(created, instructorName, 0, 0);
    } catch (error) {
      if (error instanceof Error) {
        // Re-throw known errors
        if (Object.values(CourseError).includes(error.message as CourseError)) {
          throw error;
        }
      }
      throw new Error(CourseError.INTERNAL_SERVER_ERROR);
    }
  }
}
