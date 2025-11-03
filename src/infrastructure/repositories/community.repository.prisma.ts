import { ICommunityRepository } from "@/application/ports/ICommunityRepository";
import { Community } from "@/domain/community/community.entity";
import { CommunityPrismaMapper } from "@/infrastructure/mappers/community-prisma.mapper";
import { prisma } from "@/lib/prisma";

/**
 * Prisma implementation of ICommunityRepository.
 *
 * Part of the Infrastructure layer - implements the repository port using Prisma ORM.
 *
 * Key responsibilities:
 * - Execute database operations via Prisma client
 * - Apply soft delete filter to all find operations (deletedAt IS NULL)
 * - Use CommunityPrismaMapper to convert between domain entities and Prisma models
 * - Handle database errors and convert to domain-appropriate errors
 *
 * Note: The current Prisma schema doesn't include ownerId and primaryColor fields.
 * These will need to be added via database migration to fully support the domain model.
 */
export class CommunityRepositoryPrisma implements ICommunityRepository {
  /**
   * Find a community by its unique ID.
   */
  async findById(id: string): Promise<Community | null> {
    const prismaCommunity = await prisma.community.findFirst({
      where: {
        id,
        deletedAt: null, // Soft delete filter
      },
    });

    if (!prismaCommunity) {
      return null;
    }

    // Note: Temporarily pass empty ownerId until schema is updated
    return CommunityPrismaMapper.toDomain({
      ...prismaCommunity,
      ownerId: "", // TODO: Add ownerId to schema
      primaryColor: "#0066CC", // TODO: Add primaryColor to schema
    });
  }

  /**
   * Find a community by its unique slug.
   */
  async findBySlug(slug: string): Promise<Community | null> {
    const prismaCommunity = await prisma.community.findFirst({
      where: {
        slug,
        deletedAt: null, // Soft delete filter
      },
    });

    if (!prismaCommunity) {
      return null;
    }

    return CommunityPrismaMapper.toDomain({
      ...prismaCommunity,
      ownerId: "", // TODO: Add ownerId to schema
      primaryColor: "#0066CC", // TODO: Add primaryColor to schema
    });
  }

  /**
   * Find all communities owned by a specific user.
   *
   * Note: This will work properly once ownerId is added to the schema.
   * Currently returns empty array as ownerId is not in the database.
   */
  async findByOwnerId(ownerId: string): Promise<Community[]> {
    // TODO: Update this query once ownerId is added to schema
    // For now, we'll find communities where the user is an OWNER via CommunityMember
    const memberships = await prisma.communityMember.findMany({
      where: {
        userId: ownerId,
        role: "OWNER",
        deletedAt: null,
      },
      include: {
        community: true,
      },
    });

    return memberships
      .filter((membership) => membership.community.deletedAt === null)
      .map((membership) =>
        CommunityPrismaMapper.toDomain({
          ...membership.community,
          ownerId: membership.userId, // Use membership's userId as ownerId
          primaryColor: "#0066CC", // TODO: Add primaryColor to schema
        })
      );
  }

  /**
   * Find all communities (non-deleted).
   */
  async findAll(): Promise<Community[]> {
    const communities = await prisma.community.findMany({
      where: {
        deletedAt: null, // Soft delete filter
      },
    });

    return communities.map((community) =>
      CommunityPrismaMapper.toDomain({
        ...community,
        ownerId: "", // TODO: Add ownerId to schema
        primaryColor: "#0066CC", // TODO: Add primaryColor to schema
      })
    );
  }

  /**
   * Create a new community.
   */
  async create(community: Community): Promise<Community> {
    try {
      const persistence = CommunityPrismaMapper.toPersistence(community);

      const created = await prisma.community.create({
        data: {
          id: persistence.id,
          name: persistence.name,
          slug: persistence.slug,
          description: persistence.description,
          logoUrl: persistence.logoUrl,
          darkMode: persistence.darkMode,
          // TODO: Add ownerId and primaryColor when schema is updated
        },
      });

      return CommunityPrismaMapper.toDomain({
        ...created,
        ownerId: community.getOwnerId(),
        primaryColor: community.getPrimaryColor(),
      });
    } catch (error) {
      // Handle unique constraint violations
      if (error instanceof Error && error.message.includes("Unique constraint")) {
        if (error.message.includes("slug")) {
          throw new Error("Community slug already exists");
        }
      }
      throw error;
    }
  }

  /**
   * Update an existing community.
   */
  async update(community: Community): Promise<Community> {
    const persistence = CommunityPrismaMapper.toPersistence(community);

    try {
      const updated = await prisma.community.update({
        where: { id: community.getId() },
        data: {
          name: persistence.name,
          slug: persistence.slug,
          description: persistence.description,
          logoUrl: persistence.logoUrl,
          darkMode: persistence.darkMode,
          updatedAt: persistence.updatedAt,
          // TODO: Add ownerId and primaryColor when schema is updated
        },
      });

      return CommunityPrismaMapper.toDomain({
        ...updated,
        ownerId: community.getOwnerId(),
        primaryColor: community.getPrimaryColor(),
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Record to update not found")) {
        throw new Error("Community not found or is archived");
      }
      throw error;
    }
  }

  /**
   * Archive (soft delete) a community by setting deletedAt timestamp.
   */
  async archive(id: string): Promise<void> {
    try {
      const community = await prisma.community.findUnique({
        where: { id },
      });

      if (!community) {
        throw new Error("Community not found");
      }

      if (community.deletedAt !== null) {
        throw new Error("Community is already archived");
      }

      await prisma.community.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Record to update not found")) {
        throw new Error("Community not found");
      }
      throw error;
    }
  }

  /**
   * Restore a soft-deleted community by clearing deletedAt timestamp.
   */
  async restore(id: string): Promise<void> {
    try {
      const community = await prisma.community.findUnique({
        where: { id },
      });

      if (!community) {
        throw new Error("Community not found");
      }

      if (community.deletedAt === null) {
        throw new Error("Community is not archived");
      }

      await prisma.community.update({
        where: { id },
        data: { deletedAt: null },
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Record to update not found")) {
        throw new Error("Community not found");
      }
      throw error;
    }
  }

  /**
   * Permanently delete a community from the database.
   * This operation is irreversible - use sparingly.
   */
  async delete(id: string): Promise<void> {
    try {
      await prisma.community.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
        throw new Error("Community not found");
      }
      throw error;
    }
  }
}
