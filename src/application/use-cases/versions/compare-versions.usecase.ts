/**
 * Compare Versions Use Case
 * Retrieves two versions for comparison (future: add diff analysis)
 */

import { IContentVersionRepository } from '@/ports/repositories';
import { ContentVersionDto } from '@/application/dtos/content-version.dto';
import { ContentVersionDtoMapper } from '@/application/mappers/content-version-dto.mapper';
import { ContentVersionError } from '@/application/errors/content-version.errors';

export interface CompareVersionsDto {
  contentId: string;
  oldVersion: ContentVersionDto;
  newVersion: ContentVersionDto;
  // Future: Add diff analysis here
  // diff?: DiffResult;
}

export class CompareVersionsUseCase {
  constructor(private readonly versionRepository: IContentVersionRepository) {}

  async execute(
    contentId: string,
    oldVersionNumber: number,
    newVersionNumber: number
  ): Promise<CompareVersionsDto> {
    try {
      // Validate input
      if (!contentId ||
          contentId.trim().length === 0 ||
          oldVersionNumber < 1 ||
          newVersionNumber < 1) {
        throw new Error(ContentVersionError.INVALID_INPUT);
      }

      if (oldVersionNumber === newVersionNumber) {
        throw new Error(ContentVersionError.INVALID_INPUT);
      }

      // Fetch both versions
      const oldVersion = await this.versionRepository.findByContentIdAndVersion(
        contentId,
        oldVersionNumber
      );

      const newVersion = await this.versionRepository.findByContentIdAndVersion(
        contentId,
        newVersionNumber
      );

      if (!oldVersion || !newVersion) {
        throw new Error(ContentVersionError.VERSION_NOT_FOUND);
      }

      return {
        contentId,
        oldVersion: ContentVersionDtoMapper.toDto(oldVersion),
        newVersion: ContentVersionDtoMapper.toDto(newVersion)
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ContentVersionError.INVALID_INPUT ||
            error.message === ContentVersionError.VERSION_NOT_FOUND) {
          throw error;
        }
      }
      throw new Error(ContentVersionError.INTERNAL_SERVER_ERROR);
    }
  }
}
