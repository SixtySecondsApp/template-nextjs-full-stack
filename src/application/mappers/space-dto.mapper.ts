/**
 * Space DTO Mapper
 * Maps between Space domain entity and SpaceDto
 */

import { Space } from '@/domain/space/space.entity';
import { SpaceDto } from '../dtos/space.dto';

export class SpaceDtoMapper {
  /**
   * Map from Domain entity to DTO
   */
  public static toDto(space: Space): SpaceDto {
    return {
      id: space.getId(),
      communityId: space.getCommunityId(),
      parentSpaceId: space.getParentSpaceId(),
      name: space.getName(),
      description: space.getDescription(),
      icon: space.getIcon(),
      color: space.getColor(),
      position: space.getPosition(),
      createdBy: space.getCreatedBy(),
      createdAt: space.getCreatedAt().toISOString(),
      updatedAt: space.getUpdatedAt().toISOString(),
      deletedAt: space.getDeletedAt()?.toISOString() ?? null,
    };
  }

  /**
   * Map from DTO to Domain entity
   * Note: Used for reconstitution from API input
   */
  public static toDomain(dto: SpaceDto): Space {
    return Space.reconstitute(
      dto.id,
      dto.communityId,
      dto.name,
      dto.description,
      dto.parentSpaceId,
      dto.icon,
      dto.color,
      dto.position,
      dto.createdBy,
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
      dto.deletedAt ? new Date(dto.deletedAt) : null
    );
  }
}
