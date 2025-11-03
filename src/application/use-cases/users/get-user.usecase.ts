/**
 * Get User Use Case
 * Retrieves a single user by ID
 * Returns DTOs, depends on repository interfaces
 */

import { IUserRepository } from "@/ports/repositories";
import { UserDto } from "@/application/dtos/user.dto";
import { UserDtoMapper } from "@/application/mappers/user-dto.mapper";
import { UserError } from "@/application/errors/user.errors";

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserDto> {
    try {
      // Validate input
      if (!userId || userId.trim().length === 0) {
        throw new Error(UserError.INVALID_INPUT);
      }

      // Retrieve user from repository
      const user = await this.userRepository.findById(userId);

      // Check if user exists
      if (!user) {
        throw new Error(UserError.USER_NOT_FOUND);
      }

      // Return DTO
      return UserDtoMapper.toDto(user);
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
