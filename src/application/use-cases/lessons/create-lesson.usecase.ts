/**
 * Create Lesson Use Case
 * Creates a new lesson within a course
 * Verifies course exists and user is instructor
 */

import { ICourseRepository, ILessonRepository } from "@/ports/repositories";
import { CreateLessonDto, LessonDto } from "@/application/dtos/lesson.dto";
import { LessonDtoMapper } from "@/application/mappers/lesson-dto.mapper";
import { LessonError } from "@/application/errors/lesson.errors";

export class CreateLessonUseCase {
  constructor(
    private lessonRepository: ILessonRepository,
    private courseRepository: ICourseRepository
  ) {}

  /**
   * Execute create lesson operation
   * @param input CreateLessonDto with required fields
   * @param requestingUserId User creating the lesson (must be instructor)
   * @returns LessonDto with assigned ID
   * @throws Error with LessonError enum values
   */
  async execute(
    input: CreateLessonDto,
    requestingUserId: string
  ): Promise<LessonDto> {
    try {
      // Verify course exists
      const course = await this.courseRepository.findById(input.courseId);
      if (!course) {
        throw new Error(LessonError.COURSE_NOT_FOUND);
      }

      // Verify user is course instructor
      if (course.getInstructorId() !== requestingUserId) {
        throw new Error(LessonError.NOT_COURSE_INSTRUCTOR);
      }

      // Validate input
      if (!input.title || input.title.trim().length === 0) {
        throw new Error(LessonError.INVALID_TITLE);
      }
      if (!input.content || input.content.trim().length === 0) {
        throw new Error(LessonError.INVALID_CONTENT);
      }
      if (!["TEXT", "VIDEO_EMBED", "PDF"].includes(input.type)) {
        throw new Error(LessonError.INVALID_TYPE);
      }

      // Type-specific validation
      if (input.type === "VIDEO_EMBED" && !input.videoUrl) {
        throw new Error(LessonError.MISSING_VIDEO_URL);
      }
      if (input.type === "PDF" && !input.pdfUrl) {
        throw new Error(LessonError.MISSING_PDF_URL);
      }

      // Create domain entity (assuming Lesson.create exists)
      // TODO: Replace with actual Lesson entity
      const lesson = {
        getId: () => crypto.randomUUID(),
        getCourseId: () => input.courseId,
        getTitle: () => input.title,
        getContent: () => input.content,
        getType: () => input.type,
        getVideoUrl: () => input.videoUrl || null,
        getPdfUrl: () => input.pdfUrl || null,
        getOrder: () => input.order,
        getDripAvailableAt: () => null,
        getCreatedAt: () => new Date(),
        getUpdatedAt: () => new Date(),
      };

      // Persist via repository
      const created = await this.lessonRepository.create(lesson);

      // Return DTO
      return LessonDtoMapper.toDto(created);
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
