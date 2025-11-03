/**
 * User DTO Mapper
 * Converts between Domain entities and DTOs
 * Maintains strict boundary between application and domain layers
 */

import { User } from "@/domain/user/user.entity";
import { UserDto } from "@/application/dtos/user.dto";

export class UserDtoMapper {
  /**
   * Convert User domain entity to UserDto
   */
  static toDto(user: User): UserDto {
    return {
      id: user.getId(),
      email: user.getEmail(),
      name: user.getName(),
      role: user.getRole(),
      communityId: user.getCommunityId(),
      avatarUrl: user.getAvatarUrl(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }

  /**
   * Convert array of User entities to array of UserDtos
   */
  static toDtoArray(users: User[]): UserDto[] {
    return users.map((user) => this.toDto(user));
  }
}
