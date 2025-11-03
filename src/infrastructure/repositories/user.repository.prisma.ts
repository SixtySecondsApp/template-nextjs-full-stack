import { IUserRepository } from "@/application/ports/IUserRepository";
import { User } from "@/domain/user/user.entity";
import { UserPrismaMapper } from "@/infrastructure/mappers/user-prisma.mapper";
import { prisma } from "@/lib/prisma";

/**
 * Prisma implementation of IUserRepository.
 *
 * Part of the Infrastructure layer - implements the repository port using Prisma ORM.
 *
 * Key responsibilities:
 * - Execute database operations via Prisma client
 * - Apply soft delete filter to all find operations (deletedAt IS NULL)
 * - Use UserPrismaMapper to convert between domain entities and Prisma models
 * - Handle database errors and convert to domain-appropriate errors
 *
 * Note: Users in this system are tied to communities via CommunityMember relationship.
 * All operations must consider this relationship.
 */
export class UserRepositoryPrisma implements IUserRepository {
  /**
   * Find a user by their unique ID.
   * Includes community membership data for domain entity construction.
   */
  async findById(id: string): Promise<User | null> {
    const prismaUser = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: null, // Soft delete filter
      },
      include: {
        memberships: {
          where: {
            deletedAt: null, // Soft delete filter for memberships
          },
          take: 1, // Get first active membership
        },
      },
    });

    if (!prismaUser || !prismaUser.memberships[0]) {
      return null;
    }

    return UserPrismaMapper.toDomain(prismaUser, prismaUser.memberships[0]);
  }

  /**
   * Find a user by their Clerk authentication ID.
   */
  async findByClerkId(clerkId: string): Promise<User | null> {
    const prismaUser = await prisma.user.findFirst({
      where: {
        clerkId,
        deletedAt: null, // Soft delete filter
      },
      include: {
        memberships: {
          where: {
            deletedAt: null,
          },
          take: 1,
        },
      },
    });

    if (!prismaUser || !prismaUser.memberships[0]) {
      return null;
    }

    return UserPrismaMapper.toDomain(prismaUser, prismaUser.memberships[0]);
  }

  /**
   * Find a user by their email address.
   */
  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await prisma.user.findFirst({
      where: {
        email,
        deletedAt: null, // Soft delete filter
      },
      include: {
        memberships: {
          where: {
            deletedAt: null,
          },
          take: 1,
        },
      },
    });

    if (!prismaUser || !prismaUser.memberships[0]) {
      return null;
    }

    return UserPrismaMapper.toDomain(prismaUser, prismaUser.memberships[0]);
  }

  /**
   * Find all users in a specific community.
   */
  async findByCommunityId(communityId: string): Promise<User[]> {
    const memberships = await prisma.communityMember.findMany({
      where: {
        communityId,
        deletedAt: null, // Soft delete filter
      },
      include: {
        user: true,
      },
    });

    return memberships
      .filter((membership) => membership.user.deletedAt === null) // Ensure user is not deleted
      .map((membership) =>
        UserPrismaMapper.toDomain(membership.user, membership)
      );
  }

  /**
   * Create a new user with community membership.
   *
   * Note: This creates both User and CommunityMember records in a transaction.
   */
  async create(user: User): Promise<User> {
    try {
      const userPersistence = UserPrismaMapper.toPersistence(user);
      const membershipPersistence =
        UserPrismaMapper.toCommunityMemberPersistence(user);

      // Use transaction to ensure both User and CommunityMember are created atomically
      const result = await prisma.$transaction(async (tx) => {
        // Create user
        const createdUser = await tx.user.create({
          data: {
            id: userPersistence.id,
            clerkId: userPersistence.clerkId,
            email: userPersistence.email,
            firstName: userPersistence.firstName,
            lastName: userPersistence.lastName,
            imageUrl: userPersistence.imageUrl,
          },
        });

        // Create community membership
        const createdMembership = await tx.communityMember.create({
          data: {
            userId: membershipPersistence.userId,
            communityId: membershipPersistence.communityId,
            role: membershipPersistence.role,
          },
        });

        return { user: createdUser, membership: createdMembership };
      });

      return UserPrismaMapper.toDomain(result.user, result.membership);
    } catch (error) {
      // Handle unique constraint violations
      if (error instanceof Error && error.message.includes("Unique constraint")) {
        if (error.message.includes("email")) {
          throw new Error("Email already exists");
        }
        if (error.message.includes("clerkId")) {
          throw new Error("Clerk ID already exists");
        }
      }
      throw error;
    }
  }

  /**
   * Update an existing user.
   *
   * Note: This updates both User and CommunityMember records if role changed.
   */
  async update(user: User): Promise<User> {
    const userPersistence = UserPrismaMapper.toPersistence(user);
    const membershipPersistence =
      UserPrismaMapper.toCommunityMemberPersistence(user);

    try {
      const result = await prisma.$transaction(async (tx) => {
        // Update user
        const updatedUser = await tx.user.update({
          where: { id: user.getId() },
          data: {
            email: userPersistence.email,
            firstName: userPersistence.firstName,
            lastName: userPersistence.lastName,
            imageUrl: userPersistence.imageUrl,
            updatedAt: userPersistence.updatedAt,
          },
        });

        // Update community membership role
        const updatedMembership = await tx.communityMember.updateMany({
          where: {
            userId: user.getId(),
            communityId: user.getCommunityId(),
            deletedAt: null,
          },
          data: {
            role: membershipPersistence.role,
          },
        });

        // Fetch the membership for mapping
        const membership = await tx.communityMember.findFirst({
          where: {
            userId: user.getId(),
            communityId: user.getCommunityId(),
            deletedAt: null,
          },
        });

        if (!membership) {
          throw new Error("User membership not found after update");
        }

        return { user: updatedUser, membership };
      });

      return UserPrismaMapper.toDomain(result.user, result.membership);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Record to update not found")) {
        throw new Error("User not found or is archived");
      }
      throw error;
    }
  }

  /**
   * Archive (soft delete) a user by setting deletedAt timestamp.
   */
  async archive(id: string): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (user.deletedAt !== null) {
        throw new Error("User is already archived");
      }

      await prisma.user.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Record to update not found")) {
        throw new Error("User not found");
      }
      throw error;
    }
  }

  /**
   * Restore a soft-deleted user by clearing deletedAt timestamp.
   */
  async restore(id: string): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (user.deletedAt === null) {
        throw new Error("User is not archived");
      }

      await prisma.user.update({
        where: { id },
        data: { deletedAt: null },
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Record to update not found")) {
        throw new Error("User not found");
      }
      throw error;
    }
  }

  /**
   * Permanently delete a user from the database.
   * This operation is irreversible - use sparingly.
   */
  async delete(id: string): Promise<void> {
    try {
      await prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
        throw new Error("User not found");
      }
      throw error;
    }
  }
}
