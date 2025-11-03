/**
 * Update User Use Case
 * Updates user profile information
 * Returns DTOs, depends on repository interfaces
 */

import { IUserRepository } from "@/ports/repositories";
import { UserDto, UpdateUserDto } from "@/application/dtos/user.dto";
import { UserDtoMapper } from "@/application/mappers/user-dto.mapper";
import { UserError } from "@/application/errors/user.errors";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, input: UpdateUserDto): Promise<UserDto> {
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

      // Check if email already exists (if updating email)
      if (input.email && input.email !== user.getEmail()) {
        const existingUser = await this.userRepository.findByEmail(input.email);
        if (existingUser) {
          throw new Error(UserError.EMAIL_ALREADY_EXISTS);
        }
      }

      // Update user profile (domain logic handles validation)
      user.updateProfile({
        name: input.name,
        email: input.email,
        avatarUrl: input.avatarUrl,
      });

      // Persist changes
      const updatedUser = await this.userRepository.update(user);

      // Return DTO
      return UserDtoMapper.toDto(updatedUser);
    } catch (error) {
      if (error instanceof Error) {
        // Re-throw known application errors
        if (Object.values(UserError).includes(error.message as UserError)) {
          throw error;
        }

        // Map domain validation errors to application errors
        if (error.message.includes("email")) {
          throw new Error(UserError.INVALID_EMAIL);
        }
        if (error.message.includes("name")) {
          throw new Error(UserError.INVALID_NAME);
        }
        if (error.message.includes("avatar")) {
          throw new Error(UserError.INVALID_AVATAR_URL);
        }
        if (error.message.includes("archived")) {
          throw new Error(UserError.CANNOT_MODIFY_ARCHIVED_USER);
        }
      }

      // Unknown error
      throw new Error(UserError.INTERNAL_SERVER_ERROR);
    }
  }
}
