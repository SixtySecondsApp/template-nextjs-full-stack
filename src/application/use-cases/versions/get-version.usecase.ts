/**
 * Get Specific Version Use Case
 * Retrieves a specific version of content by content ID and version number
 */

import { IContentVersionRepository } from '@/ports/repositories';
import { ContentVersionDto } from '@/application/dtos/content-version.dto';
import { ContentVersionDtoMapper } from '@/application/mappers/content-version-dto.mapper';
import { ContentVersionError } from '@/application/errors/content-version.errors';

export class GetVersionUseCase {
  constructor(private readonly versionRepository: IContentVersionRepository) {}

  async execute(contentId: string, versionNumber: number): Promise<ContentVersionDto> {
    try {
      // Validate input
      if (!contentId || contentId.trim().length === 0 || versionNumber < 1) {
        throw new Error(ContentVersionError.INVALID_INPUT);
      }

      // Fetch specific version
      const version = await this.versionRepository.findByContentIdAndVersion(
        contentId,
        versionNumber
      );

      if (!version) {
        throw new Error(ContentVersionError.VERSION_NOT_FOUND);
      }

      return ContentVersionDtoMapper.toDto(version);
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
