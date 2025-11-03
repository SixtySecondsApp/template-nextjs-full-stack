import { ContentVersion } from "@/domain/content-version/content-version.entity";
import {
  ContentVersion as PrismaContentVersion,
  ContentType as PrismaContentType,
} from "@prisma/client";

/**
 * Prisma Mapper for ContentVersion
 *
 * Translates between the ContentVersion domain entity and Prisma persistence model.
 * Part of the infrastructure layer - maintains boundary between domain and database.
 *
 * Key responsibilities:
 * - Convert Prisma models to domain entities (toDomain)
 * - Convert domain entities to Prisma persistence format (toPersistence)
 * - Handle enum conversions between domain and Prisma
 * - Ensure no Prisma types leak into domain layer
 */
export class ContentVersionPrismaMapper {
  /**
   * Convert Prisma ContentVersion model to domain entity.
   *
   * Used when reading from database via repository.
   *
   * @param prismaVersion Prisma ContentVersion model from database
   * @returns ContentVersion domain entity
   */
  static toDomain(prismaVersion: PrismaContentVersion): ContentVersion {
    // ContentVersion is immutable - we use reconstitute for hydration from DB
    return ContentVersion.reconstitute({
      id: prismaVersion.id,
      contentType: prismaVersion.contentType as "POST" | "COMMENT",
      contentId: prismaVersion.contentId,
      content: prismaVersion.content,
      versionNumber: prismaVersion.versionNumber,
      createdAt: prismaVersion.createdAt,
    });
  }

  /**
   * Convert domain entity to Prisma persistence format.
   *
   * Used when writing to database via repository.
   *
   * @param version ContentVersion domain entity
   * @returns Plain object for Prisma operations
   */
  static toPersistence(version: ContentVersion): {
    id: string;
    contentType: PrismaContentType;
    contentId: string;
    content: string;
    versionNumber: number;
    createdAt: Date;
  } {
    return {
      id: version.getId(),
      contentType: version.getContentType() as PrismaContentType,
      contentId: version.getContentId(),
      content: version.getContent(),
      versionNumber: version.getVersionNumber(),
      createdAt: version.getCreatedAt(),
    };
  }
}
