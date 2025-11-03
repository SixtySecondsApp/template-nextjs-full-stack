/**
 * Content Version DTO Mapper
 * Translates between Domain (ContentVersion) and Application (DTO) layers
 */

import { ContentVersion } from '@/domain/content-version/content-version.entity';
import { ContentVersionDto } from '@/application/dtos/content-version.dto';

export class ContentVersionDtoMapper {
  static toDto(version: ContentVersion): ContentVersionDto {
    return {
      id: version.getId(),
      contentType: version.getContentType(),
      contentId: version.getContentId(),
      content: version.getContent(),
      versionNumber: version.getVersionNumber(),
      createdAt: version.getCreatedAt()
    };
  }

  static toDtoArray(versions: ContentVersion[]): ContentVersionDto[] {
    return versions.map((v) => this.toDto(v));
  }
}
