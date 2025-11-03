/**
 * Mark Complete Use Case
 * Marks a lesson as complete within user's course progress
 * Simplified version of TrackProgressUseCase for explicit completion marking
 */

import {
  ICourseProgressRepository,
  ILessonRepository,
} from "@/ports/repositories";
import { MarkCompleteDto, ProgressDto } from "@/application/dtos/progress.dto";
import { ProgressDtoMapper } from "@/application/mappers/progress-dto.mapper";
import { ProgressError } from "@/application/errors/progress.errors";

export class MarkCompleteUseCase {
  constructor(
    private progressRepository: ICourseProgressRepository,
    private lessonRepository: ILessonRepository
  ) {}

  /**
   * Execute mark complete operation
   * @param userId User ID
   * @param courseId Course ID
   * @param input MarkCompleteDto with lessonId
   * @returns Updated ProgressDto
   * @throws Error with ProgressError enum values
   */
  async execute(
    userId: string,
    courseId: string,
    input: MarkCompleteDto
  ): Promise<ProgressDto> {
    try {
      // Find progress
      const progress = await this.progressRepository.findByUserIdAndCourseId(
        userId,
        courseId
      );
      if (!progress) {
        throw new Error(ProgressError.PROGRESS_NOT_FOUND);
      }

      // Verify lesson exists
      const lesson = await this.lessonRepository.findById(input.lessonId);
      if (!lesson) {
        throw new Error(ProgressError.LESSON_NOT_FOUND);
      }
      if (lesson.getCourseId() !== courseId) {
        throw new Error(ProgressError.INVALID_LESSON_ID);
      }

      // Check if already completed
      if (progress.getCompletedLessonIds().includes(input.lessonId)) {
        throw new Error(ProgressError.LESSON_ALREADY_COMPLETED);
      }

      // Mark complete via domain method
      // TODO: Replace with actual CourseProgress entity method
      // progress.markLessonComplete(input.lessonId);

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
