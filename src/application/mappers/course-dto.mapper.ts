/**
 * Course DTO Mapper
 * Converts between Domain Course entities and CourseDto
 * Maintains strict boundary between application and domain layers
 * 
 * Note: This assumes Course domain entity exists with proper getters
 * TODO: Update when Course entity is implemented
 */

import { CourseDto } from "@/application/dtos/course.dto";

export class CourseDtoMapper {
  /**
   * Convert Course domain entity to CourseDto
   * @param course Domain Course entity
   * @param instructorName Instructor name from User entity
   * @param lessonCount Lesson count from repository
   * @param enrolledCount Enrolled count from progress repository
   * @returns CourseDto for API responses
   */
  static toDto(
    course: any, // TODO: Replace with Course entity
    instructorName: string,
    lessonCount: number,
    enrolledCount: number
  ): CourseDto {
    return {
      id: course.getId(),
      communityId: course.getCommunityId(),
      title: course.getTitle(),
      description: course.getDescription(),
      instructorId: course.getInstructorId(),
      instructorName,
      isPublished: course.getIsPublished(),
      publishedAt: course.getPublishedAt()?.toISOString() ?? null,
      lessonCount,
      enrolledCount,
      createdAt: course.getCreatedAt().toISOString(),
      updatedAt: course.getUpdatedAt().toISOString(),
    };
  }

  /**
   * Convert array of Course entities to array of CourseDtos
   * @param courses Array of domain Course entities with metadata
   * @returns Array of CourseDto for API responses
   */
  static toDtoArray(
    courses: Array<{
      course: any;
      instructorName: string;
      lessonCount: number;
      enrolledCount: number;
    }>
  ): CourseDto[] {
    return courses.map((item) =>
      this.toDto(
        item.course,
        item.instructorName,
        item.lessonCount,
        item.enrolledCount
      )
    );
  }
}
