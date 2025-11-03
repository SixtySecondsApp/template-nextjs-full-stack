/**
 * Channel DTO Mapper
 * Maps between Channel domain entity and ChannelDto
 */

import { Channel } from '@/domain/channel/channel.entity';
import { ChannelDto, ChannelPermissionDto } from '../dtos/channel.dto';
import { ChannelPermission } from '@/domain/channel/channel.types';

export class ChannelDtoMapper {
  /**
   * Map from Domain entity to DTO
   */
  public static toDto(channel: Channel): ChannelDto {
    return {
      id: channel.getId(),
      communityId: channel.getCommunityId(),
      spaceId: channel.getSpaceId(),
      name: channel.getName(),
      description: channel.getDescription(),
      permission: channel.getPermission() as ChannelPermissionDto,
      requiredTierId: channel.getRequiredTierId(),
      icon: channel.getIcon(),
      position: channel.getPosition(),
      createdBy: channel.getCreatedBy(),
      createdAt: channel.getCreatedAt().toISOString(),
      updatedAt: channel.getUpdatedAt().toISOString(),
      deletedAt: channel.getDeletedAt()?.toISOString() ?? null,
    };
  }

  /**
   * Map from DTO to Domain entity
   * Note: Used for reconstitution from API input
   */
  public static toDomain(dto: ChannelDto): Channel {
    return Channel.reconstitute(
      dto.id,
      dto.communityId,
      dto.spaceId,
      dto.name,
      dto.description,
      dto.permission as ChannelPermission,
      dto.requiredTierId,
      dto.icon,
      dto.position,
      dto.createdBy,
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
      dto.deletedAt ? new Date(dto.deletedAt) : null
    );
  }
}
