/**
 * List Users Use Case
 * Retrieves all users in a community
 * Returns DTOs, depends on repository interfaces
 */

import { IUserRepository } from "@/ports/repositories";
import { UserDto } from "@/application/dtos/user.dto";
import { UserDtoMapper } from "@/application/mappers/user-dto.mapper";
import { UserError } from "@/application/errors/user.errors";

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(communityId: string): Promise<UserDto[]> {
    try {
      // Validate input
      if (!communityId || communityId.trim().length === 0) {
        throw new Error(UserError.INVALID_INPUT);
      }

      // Retrieve users from repository
      const users = await this.userRepository.findByCommunityId(communityId);

      // Return DTOs
      return UserDtoMapper.toDtoArray(users);
    } catch (error) {
      if (error instanceof Error) {
        // Re-throw known application errors
        if (Object.values(UserError).includes(error.message as UserError)) {
          throw error;
        }
      }

      // Unknown error
      throw new Error(UserError.INTERNAL_SERVER_ERROR);
    }
  }
}
