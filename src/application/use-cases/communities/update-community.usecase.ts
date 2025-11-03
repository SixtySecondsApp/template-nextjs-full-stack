/**
 * Update Community Use Case
 * Updates community branding information
 * Returns DTOs, depends on repository interfaces
 */

import { ICommunityRepository } from "@/ports/repositories";
import { CommunityDto, UpdateCommunityDto } from "@/application/dtos/community.dto";
import { CommunityDtoMapper } from "@/application/mappers/community-dto.mapper";
import { CommunityError } from "@/application/errors/community.errors";

export class UpdateCommunityUseCase {
  constructor(private readonly communityRepository: ICommunityRepository) {}

  async execute(
    communityId: string,
    input: UpdateCommunityDto
  ): Promise<CommunityDto> {
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

      // Update community branding (domain logic handles validation)
      community.updateBranding({
        name: input.name,
        logoUrl: input.logoUrl,
        primaryColor: input.primaryColor,
      });

      // Persist changes
      const updatedCommunity = await this.communityRepository.update(community);

      // Return DTO
      return CommunityDtoMapper.toDto(updatedCommunity);
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
        if (error.message.includes("archived")) {
          throw new Error(CommunityError.CANNOT_MODIFY_ARCHIVED_COMMUNITY);
        }
      }

      // Unknown error
      throw new Error(CommunityError.INTERNAL_SERVER_ERROR);
    }
  }
}
