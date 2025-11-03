/**
 * Get Progress Use Case
 * Retrieves course progress for a user
 */

import { ICourseProgressRepository } from "@/ports/repositories";
import { ProgressDto } from "@/application/dtos/progress.dto";
import { ProgressDtoMapper } from "@/application/mappers/progress-dto.mapper";
import { ProgressError } from "@/application/errors/progress.errors";

export class GetProgressUseCase {
  constructor(private progressRepository: ICourseProgressRepository) {}

  /**
   * Execute get progress operation
   * @param userId User ID
   * @param courseId Course ID
   * @returns ProgressDto or null if not enrolled
   * @throws Error with ProgressError enum values
   */
  async execute(
    userId: string,
    courseId: string
  ): Promise<ProgressDto | null> {
    try {
      // Find progress
      const progress = await this.progressRepository.findByUserIdAndCourseId(
        userId,
        courseId
      );

      if (!progress) {
        return null;
      }

      // Return DTO
      return ProgressDtoMapper.toDto(progress);
    } catch (error) {
      throw new Error(ProgressError.INTERNAL_SERVER_ERROR);
    }
  }
}
