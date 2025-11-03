/**
 * List Communities Use Case
 * Retrieves all communities
 * Returns DTOs, depends on repository interfaces
 */

import { ICommunityRepository } from "@/ports/repositories";
import { CommunityDto } from "@/application/dtos/community.dto";
import { CommunityDtoMapper } from "@/application/mappers/community-dto.mapper";
import { CommunityError } from "@/application/errors/community.errors";

export class ListCommunitiesUseCase {
  constructor(private readonly communityRepository: ICommunityRepository) {}

  async execute(): Promise<CommunityDto[]> {
    try {
      // Retrieve communities from repository
      const communities = await this.communityRepository.findAll();

      // Return DTOs
      return CommunityDtoMapper.toDtoArray(communities);
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
