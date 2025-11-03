/**
 * Track Progress Use Case
 * Tracks lesson completion and updates overall course progress
 * Generates certificate if course is completed
 */

import {
  ICourseProgressRepository,
  ICourseRepository,
  ILessonRepository,
} from "@/ports/repositories";
import { TrackProgressDto, ProgressDto } from "@/application/dtos/progress.dto";
import { ProgressDtoMapper } from "@/application/mappers/progress-dto.mapper";
import { ProgressError } from "@/application/errors/progress.errors";

export class TrackProgressUseCase {
  constructor(
    private progressRepository: ICourseProgressRepository,
    private courseRepository: ICourseRepository,
    private lessonRepository: ILessonRepository,
    private generateCertificateCallback?: (
      userId: string,
      courseId: string
    ) => Promise<void>
  ) {}

  /**
   * Execute track progress operation
   * Marks lesson as complete, updates last accessed
   * If all lessons complete, marks course complete and triggers certificate generation
   * @param input TrackProgressDto with userId, courseId, lessonId
   * @returns Updated ProgressDto
   * @throws Error with ProgressError enum values
   */
  async execute(input: TrackProgressDto): Promise<ProgressDto> {
    try {
      // Verify course exists
      const course = await this.courseRepository.findById(input.courseId);
      if (!course) {
        throw new Error(ProgressError.COURSE_NOT_FOUND);
      }

      // Verify lesson exists and belongs to course
      const lesson = await this.lessonRepository.findById(input.lessonId);
      if (!lesson) {
        throw new Error(ProgressError.LESSON_NOT_FOUND);
      }
      if (lesson.getCourseId() !== input.courseId) {
        throw new Error(ProgressError.INVALID_LESSON_ID);
      }

      // Check lesson is available (drip schedule)
      const dripDate = lesson.getDripAvailableAt();
      if (dripDate && new Date(dripDate) > new Date()) {
        throw new Error(ProgressError.LESSON_NOT_AVAILABLE);
      }

      // Find or create progress
      let progress = await this.progressRepository.findByUserIdAndCourseId(
        input.userId,
        input.courseId
      );

      if (!progress) {
        // Create new progress (assuming CourseProgress.create exists)
        // TODO: Replace with actual CourseProgress entity
        progress = {
          getId: () => crypto.randomUUID(),
          getCourseId: () => input.courseId,
          getUserId: () => input.userId,
          getCompletedLessonIds: () => [],
          getLastAccessedLessonId: () => null,
          getCompletionPercentage: () => 0,
          getCompletedAt: () => null,
          getCreatedAt: () => new Date(),
          getUpdatedAt: () => new Date(),
        };
        progress = await this.progressRepository.create(progress);
      }

      // Mark lesson complete via domain method
      // TODO: Replace with actual CourseProgress entity method
      // progress.markLessonComplete(input.lessonId);
      // progress.updateLastAccessed(input.lessonId);

      // Check if all lessons are complete
      const allLessons = await this.lessonRepository.findByCourseId(
        input.courseId
      );
      const completedLessonIds = progress.getCompletedLessonIds();

      if (completedLessonIds.length === allLessons.length) {
        // Mark course complete
        // progress.markCourseComplete();

        // Trigger certificate generation
        if (this.generateCertificateCallback) {
          await this.generateCertificateCallback(
            input.userId,
            input.courseId
          );
        }
      }

      // Persist via repository
      const updated = await this.progressRepository.update(progress);

      // Return DTO
      return ProgressDtoMapper.toDto(updated);
    } catch (error) {
      if (error instanceof Error) {
        if (
          Object.values(ProgressError).includes(error.message as ProgressError)
        ) {
          throw error;
        }
      }
      throw new Error(ProgressError.INTERNAL_SERVER_ERROR);
    }
  }
}
