/**
 * Create Channel Use Case
 * Application Layer - Orchestrates Channel creation
 */

import { Channel } from '@/domain/channel/channel.entity';
import { IChannelRepository } from '@/ports/channel.repositories';
import { ISpaceRepository } from '@/ports/space.repositories';
import { CreateChannelDto, ChannelDto } from '@/application/dtos/channel.dto';
import { ChannelDtoMapper } from '@/application/mappers/channel-dto.mapper';
import { ChannelPermission } from '@/domain/channel/channel.types';
import { randomUUID } from 'crypto';

export enum CreateChannelError {
  INVALID_INPUT = 'INVALID_INPUT',
  SPACE_NOT_FOUND = 'SPACE_NOT_FOUND',
  TIER_REQUIRED_FOR_TIER_GATED = 'TIER_REQUIRED_FOR_TIER_GATED',
  CHANNEL_ALREADY_EXISTS = 'CHANNEL_ALREADY_EXISTS',
}

export class CreateChannelUseCase {
  constructor(
    private readonly channelRepository: IChannelRepository,
    private readonly spaceRepository: ISpaceRepository
  ) {}

  async execute(input: CreateChannelDto, userId: string): Promise<ChannelDto> {
    // Validate input
    if (!input.communityId || !input.name || !input.permission) {
      throw new Error(CreateChannelError.INVALID_INPUT);
    }

    // If space is specified, validate it exists
    if (input.spaceId) {
      const space = await this.spaceRepository.findById(input.spaceId);
      if (!space) {
        throw new Error(CreateChannelError.SPACE_NOT_FOUND);
      }
    }

    // Validate tier-gated permission
    if (input.permission === 'TIER_GATED' && !input.requiredTierId) {
      throw new Error(CreateChannelError.TIER_REQUIRED_FOR_TIER_GATED);
    }

    // Create Channel domain entity
    const channel = Channel.create({
      id: randomUUID(),
      communityId: input.communityId,
      spaceId: input.spaceId,
      name: input.name,
      description: input.description || '',
      permission: input.permission as ChannelPermission,
      requiredTierId: input.requiredTierId,
      icon: input.icon,
      position: input.position,
      createdBy: userId,
    });

    // Persist via repository
    const savedChannel = await this.channelRepository.create(channel);

    // Return DTO
    return ChannelDtoMapper.toDto(savedChannel);
  }
}
