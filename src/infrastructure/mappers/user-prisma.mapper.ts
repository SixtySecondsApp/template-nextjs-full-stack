import { User } from "@/domain/user/user.entity";
import { Role } from "@/domain/shared/role.enum";
import type { User as PrismaUser, CommunityMember as PrismaCommunityMember } from "@/generated/prisma";

/**
 * UserPrismaMapper converts between User domain entity and Prisma persistence models.
 *
 * Part of the Infrastructure layer - isolates domain from Prisma implementation details.
 *
 * Key responsibilities:
 * - Convert Prisma User + CommunityMember → User domain entity (toDomain)
 * - Convert User domain entity → Prisma persistence format (toPersistence)
 * - Handle type transformations and validation during conversion
 */
export class UserPrismaMapper {
  /**
   * Convert Prisma User model (with CommunityMember relationship) to User domain entity.
   *
   * @param prismaUser Prisma User model
   * @param membership Prisma CommunityMember model (required for role and communityId)
   * @returns User domain entity
   * @throws Error if membership is missing or invalid
   */
  static toDomain(
    prismaUser: PrismaUser,
    membership: PrismaCommunityMember
  ): User {
    if (!membership) {
      throw new Error("User must have a community membership");
    }

    // Construct full name from first and last name
    const name =
      prismaUser.firstName && prismaUser.lastName
        ? `${prismaUser.firstName} ${prismaUser.lastName}`
        : prismaUser.firstName || prismaUser.lastName || null;

    return User.reconstitute({
      id: prismaUser.id,
      email: prismaUser.email,
      name,
      role: membership.role as Role,
      communityId: membership.communityId,
      avatarUrl: prismaUser.imageUrl,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      deletedAt: prismaUser.deletedAt,
    });
  }

  /**
   * Convert User domain entity to Prisma User persistence format.
   *
   * Note: This only returns User table data. CommunityMember data must be handled separately
   * since User and CommunityMember are separate tables in Prisma.
   *
   * @param user User domain entity
   * @returns Prisma User create/update input data
   */
  static toPersistence(user: User): {
    id: string;
    clerkId: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  } {
    // Split name into first and last name for Prisma schema
    const name = user.getName();
    let firstName: string | null = null;
    let lastName: string | null = null;

    if (name) {
      const nameParts = name.trim().split(/\s+/);
      if (nameParts.length === 1) {
        firstName = nameParts[0];
      } else if (nameParts.length >= 2) {
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(" ");
      }
    }

    return {
      id: user.getId(),
      clerkId: user.getId(), // Note: In real implementation, clerkId should come from authentication context
      email: user.getEmail(),
      firstName,
      lastName,
      imageUrl: user.getAvatarUrl(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
      deletedAt: user.getDeletedAt(),
    };
  }

  /**
   * Convert User domain entity to CommunityMember persistence format.
   *
   * @param user User domain entity
   * @returns Prisma CommunityMember create/update input data
   */
  static toCommunityMemberPersistence(user: User): {
    userId: string;
    communityId: string;
    role: Role;
    deletedAt: Date | null;
  } {
    return {
      userId: user.getId(),
      communityId: user.getCommunityId(),
      role: user.getRole(),
      deletedAt: user.getDeletedAt(),
    };
  }
}
