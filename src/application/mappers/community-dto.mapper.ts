/**
 * Community DTO Mapper
 * Converts between Domain entities and DTOs
 * Maintains strict boundary between application and domain layers
 */

import { Community } from "@/domain/community/community.entity";
import { CommunityDto } from "@/application/dtos/community.dto";

export class CommunityDtoMapper {
  /**
   * Convert Community domain entity to CommunityDto
   */
  static toDto(community: Community): CommunityDto {
    return {
      id: community.getId(),
      name: community.getName(),
      logoUrl: community.getLogoUrl(),
      primaryColor: community.getPrimaryColor(),
      ownerId: community.getOwnerId(),
      createdAt: community.getCreatedAt(),
      updatedAt: community.getUpdatedAt(),
    };
  }

  /**
   * Convert array of Community entities to array of CommunityDtos
   */
  static toDtoArray(communities: Community[]): CommunityDto[] {
    return communities.map((community) => this.toDto(community));
  }
}
