/**
 * Create User Use Case
 * Orchestrates user creation logic
 * Returns DTOs, depends on repository interfaces
 */

import { User } from "@/domain/user/user.entity";
import { IUserRepository } from "@/ports/repositories";
import { UserDto, CreateUserDto } from "@/application/dtos/user.dto";
import { UserDtoMapper } from "@/application/mappers/user-dto.mapper";
import { UserError } from "@/application/errors/user.errors";

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: CreateUserDto): Promise<UserDto> {
    try {
      // Check if email already exists
      const existingUser = await this.userRepository.findByEmail(input.email);
      if (existingUser) {
        throw new Error(UserError.EMAIL_ALREADY_EXISTS);
      }

      // Create domain entity
      const user = User.create({
        id: crypto.randomUUID(),
        email: input.email,
        name: input.name,
        role: input.role,
        communityId: input.communityId,
        avatarUrl: input.avatarUrl,
      });

      // Persist via repository
      const savedUser = await this.userRepository.create(user);

      // Return DTO
      return UserDtoMapper.toDto(savedUser);
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
        if (error.message.includes("role")) {
          throw new Error(UserError.INVALID_ROLE);
        }
        if (error.message.includes("avatar")) {
          throw new Error(UserError.INVALID_AVATAR_URL);
        }
      }

      // Unknown error
      throw new Error(UserError.INTERNAL_SERVER_ERROR);
    }
  }
}
