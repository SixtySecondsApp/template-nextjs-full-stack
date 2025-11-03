/**
 * Create Space Use Case
 * Application Layer - Orchestrates Space creation
 */

import { Space } from '@/domain/space/space.entity';
import { ISpaceRepository } from '@/ports/space.repositories';
import { CreateSpaceDto, SpaceDto } from '@/application/dtos/space.dto';
import { SpaceDtoMapper } from '@/application/mappers/space-dto.mapper';
import { randomUUID } from 'crypto';

export enum CreateSpaceError {
  INVALID_INPUT = 'INVALID_INPUT',
  PARENT_SPACE_NOT_FOUND = 'PARENT_SPACE_NOT_FOUND',
  MAX_NESTING_LEVEL_EXCEEDED = 'MAX_NESTING_LEVEL_EXCEEDED',
  SPACE_ALREADY_EXISTS = 'SPACE_ALREADY_EXISTS',
}

export class CreateSpaceUseCase {
  constructor(private readonly spaceRepository: ISpaceRepository) {}

  async execute(input: CreateSpaceDto, userId: string): Promise<SpaceDto> {
    // Validate input
    if (!input.communityId || !input.name) {
      throw new Error(CreateSpaceError.INVALID_INPUT);
    }

    // If parent space is specified, validate it exists and check nesting level
    if (input.parentSpaceId) {
      const parentSpace = await this.spaceRepository.findById(input.parentSpaceId);

      if (!parentSpace) {
        throw new Error(CreateSpaceError.PARENT_SPACE_NOT_FOUND);
      }

      // Check if parent is already a child (max 2 levels)
      if (!parentSpace.isParentSpace()) {
        throw new Error(CreateSpaceError.MAX_NESTING_LEVEL_EXCEEDED);
      }
    }

    // Create Space domain entity
    const space = Space.create({
      id: randomUUID(),
      communityId: input.communityId,
      name: input.name,
      description: input.description || '',
      parentSpaceId: input.parentSpaceId,
      icon: input.icon,
      color: input.color,
      position: input.position,
      createdBy: userId,
    });

    // Persist via repository
    const savedSpace = await this.spaceRepository.create(space);

    // Return DTO
    return SpaceDtoMapper.toDto(savedSpace);
  }
}
