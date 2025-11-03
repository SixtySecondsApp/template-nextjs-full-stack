/**
 * Create Community Use Case
 * Orchestrates community creation logic
 * Returns DTOs, depends on repository interfaces
 */

import { Community } from "@/domain/community/community.entity";
import { ICommunityRepository } from "@/ports/repositories";
import { CommunityDto, CreateCommunityDto } from "@/application/dtos/community.dto";
import { CommunityDtoMapper } from "@/application/mappers/community-dto.mapper";
import { CommunityError } from "@/application/errors/community.errors";

export class CreateCommunityUseCase {
  constructor(private readonly communityRepository: ICommunityRepository) {}

  async execute(input: CreateCommunityDto): Promise<CommunityDto> {
    try {
      // Create domain entity
      const community = Community.create({
        id: crypto.randomUUID(),
        name: input.name,
        logoUrl: input.logoUrl,
        primaryColor: input.primaryColor,
        ownerId: input.ownerId,
      });

      // Persist via repository
      const savedCommunity = await this.communityRepository.create(community);

      // Return DTO
      return CommunityDtoMapper.toDto(savedCommunity);
    } catch (error) {
      if (error instanceof Error) {
        // Re-throw known application errors
        if (
          Object.values(CommunityError).includes(error.message as CommunityError)
        ) {
          throw error;
        }

        // Map domain validation errors to application errors
        if (error.message.includes("name")) {
          throw new Error(CommunityError.INVALID_NAME);
        }
        if (error.message.includes("logo")) {
          throw new Error(CommunityError.INVALID_LOGO_URL);
        }
        if (error.message.includes("color")) {
          throw new Error(CommunityError.INVALID_PRIMARY_COLOR);
        }
        if (error.message.includes("owner")) {
          throw new Error(CommunityError.INVALID_OWNER_ID);
        }
      }

      // Unknown error
      throw new Error(CommunityError.INTERNAL_SERVER_ERROR);
    }
  }
}
