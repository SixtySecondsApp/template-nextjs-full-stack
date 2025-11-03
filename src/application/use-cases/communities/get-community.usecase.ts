/**
 * Get Community Use Case
 * Retrieves a single community by ID
 * Returns DTOs, depends on repository interfaces
 */

import { ICommunityRepository } from "@/ports/repositories";
import { CommunityDto } from "@/application/dtos/community.dto";
import { CommunityDtoMapper } from "@/application/mappers/community-dto.mapper";
import { CommunityError } from "@/application/errors/community.errors";

export class GetCommunityUseCase {
  constructor(private readonly communityRepository: ICommunityRepository) {}

  async execute(communityId: string): Promise<CommunityDto> {
    try {
      // Validate input
      if (!communityId || communityId.trim().length === 0) {
        throw new Error(CommunityError.INVALID_INPUT);
      }

      // Retrieve community from repository
      const community = await this.communityRepository.findById(communityId);

      // Check if community exists
      if (!community) {
        throw new Error(CommunityError.COMMUNITY_NOT_FOUND);
      }

      // Return DTO
      return CommunityDtoMapper.toDto(community);
    } catch (error) {
      if (error instanceof Error) {
        // Re-throw known application errors
        if (
          Object.values(CommunityError).includes(error.message as CommunityError)
        ) {
          throw error;
        }
      }

      // Unknown error
      throw new Error(CommunityError.INTERNAL_SERVER_ERROR);
    }
  }
}
