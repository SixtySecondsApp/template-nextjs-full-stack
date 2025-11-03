/**
 * Get Version History Use Case
 * Retrieves all versions for a specific content item (post or comment)
 */

import { IContentVersionRepository } from '@/ports/repositories';
import { ContentVersionDto } from '@/application/dtos/content-version.dto';
import { ContentVersionDtoMapper } from '@/application/mappers/content-version-dto.mapper';
import { ContentVersionError } from '@/application/errors/content-version.errors';

export class GetVersionHistoryUseCase {
  constructor(private readonly versionRepository: IContentVersionRepository) {}

  async execute(contentId: string): Promise<ContentVersionDto[]> {
    try {
      // Validate input
      if (!contentId || contentId.trim().length === 0) {
        throw new Error(ContentVersionError.INVALID_INPUT);
      }

      // Fetch all versions for this content
      const versions = await this.versionRepository.findByContentId(contentId);

      // Return empty array if no versions (rather than error)
      // This allows for graceful handling of new content without versions
      return ContentVersionDtoMapper.toDtoArray(versions);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ContentVersionError.INVALID_INPUT) {
          throw error;
        }
      }
      throw new Error(ContentVersionError.INTERNAL_SERVER_ERROR);
    }
  }
}
