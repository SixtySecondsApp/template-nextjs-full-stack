import { IContentVersionRepository } from "@/ports/repositories";
import { ContentVersion } from "@/domain/content-version/content-version.entity";
import { ContentVersionPrismaMapper } from "@/infrastructure/mappers/content-version-prisma.mapper";
import { prisma } from "@/lib/prisma";

/**
 * Prisma implementation of IContentVersionRepository.
 *
 * Part of the Infrastructure layer - implements the repository port using Prisma ORM.
 *
 * Key responsibilities:
 * - Execute database operations via Prisma client
 * - Use ContentVersionPrismaMapper to convert between domain entities and Prisma models
 * - Handle database errors and convert to domain-appropriate errors
 * - Support version history queries with efficient ordering
 *
 * Important notes:
 * - ContentVersion is an immutable audit trail - no update operations
 * - Versions are ordered DESC by default (latest first)
 * - Delete should rarely be used (versions kept for audit)
 */
export class ContentVersionRepositoryPrisma
  implements IContentVersionRepository
{
  /**
   * Create a new content version.
   * Typically called when creating or updating a post/comment.
   *
   * @param version ContentVersion domain entity
   */
  async create(version: ContentVersion): Promise<ContentVersion> {
    try {
      const data = ContentVersionPrismaMapper.toPersistence(version);

      const created = await prisma.contentVersion.create({
        data: {
          id: data.id,
          contentType: data.contentType,
          contentId: data.contentId,
          content: data.content,
          versionNumber: data.versionNumber,
          createdAt: data.createdAt,
        },
      });

      return ContentVersionPrismaMapper.toDomain(created);
    } catch (error) {
      // Handle unique constraint violations
      if (
        error instanceof Error &&
        error.message.includes("Unique constraint")
      ) {
        throw new Error(
          `Version ${version.getVersionNumber()} already exists for content ${version.getContentId()}`
        );
      }

      // Handle foreign key constraint violations
      if (
        error instanceof Error &&
        error.message.includes("Foreign key constraint")
      ) {
        throw new Error(
          `Content not found: ${version.getContentType()} ${version.getContentId()}`
        );
      }

      throw error;
    }
  }

  /**
   * Find a content version by its unique ID.
   */
  async findById(id: string): Promise<ContentVersion | null> {
    const prismaVersion = await prisma.contentVersion.findUnique({
      where: { id },
    });

    if (!prismaVersion) {
      return null;
    }

    return ContentVersionPrismaMapper.toDomain(prismaVersion);
  }

  /**
   * Find all versions for a specific piece of content.
   * Returns versions ordered by versionNumber DESC (latest first).
   *
   * Use case: Display version history for a post or comment.
   *
   * @param contentId Post or Comment ID
   */
  async findByContentId(contentId: string): Promise<ContentVersion[]> {
    const prismaVersions = await prisma.contentVersion.findMany({
      where: { contentId },
      orderBy: {
        versionNumber: "desc", // Latest version first
      },
    });

    return prismaVersions.map(ContentVersionPrismaMapper.toDomain);
  }

  /**
   * Find a specific version by content ID and version number.
   * Uses composite unique index for efficient lookup.
   *
   * Use case: View specific historical version of content.
   *
   * @param contentId Post or Comment ID
   * @param versionNumber Version number (1, 2, 3, etc.)
   */
  async findByContentIdAndVersion(
    contentId: string,
    versionNumber: number
  ): Promise<ContentVersion | null> {
    const prismaVersion = await prisma.contentVersion.findUnique({
      where: {
        contentId_versionNumber: {
          contentId,
          versionNumber,
        },
      },
    });

    if (!prismaVersion) {
      return null;
    }

    return ContentVersionPrismaMapper.toDomain(prismaVersion);
  }

  /**
   * Get the latest version for a specific piece of content.
   * Efficient query using orderBy and findFirst.
   *
   * Use case: Determine current version number before creating new version.
   *
   * @param contentId Post or Comment ID
   */
  async getLatestVersion(contentId: string): Promise<ContentVersion | null> {
    const prismaVersion = await prisma.contentVersion.findFirst({
      where: { contentId },
      orderBy: {
        versionNumber: "desc",
      },
    });

    if (!prismaVersion) {
      return null;
    }

    return ContentVersionPrismaMapper.toDomain(prismaVersion);
  }

  /**
   * Permanently delete a content version from the database.
   * This operation is irreversible.
   *
   * WARNING: Use sparingly - versions are typically kept for audit trail.
   * Consider business rules before exposing this operation.
   *
   * @param id Version ID
   */
  async delete(id: string): Promise<void> {
    try {
      await prisma.contentVersion.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Record to delete does not exist")
      ) {
        throw new Error("Content version not found");
      }
      throw error;
    }
  }
}
