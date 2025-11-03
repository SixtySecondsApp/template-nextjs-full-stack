import { Community } from "@/domain/community/community.entity";
import type { Community as PrismaCommunity } from "@/generated/prisma";

/**
 * CommunityPrismaMapper converts between Community domain entity and Prisma persistence model.
 *
 * Part of the Infrastructure layer - isolates domain from Prisma implementation details.
 *
 * Key responsibilities:
 * - Convert Prisma Community → Community domain entity (toDomain)
 * - Convert Community domain entity → Prisma persistence format (toPersistence)
 * - Handle type transformations during conversion
 *
 * Note: The Prisma schema doesn't have ownerId or primaryColor fields yet.
 * This mapper assumes they will be added to match the domain model.
 * For now, we'll use placeholder logic that can be updated when schema changes.
 */
export class CommunityPrismaMapper {
  /**
   * Convert Prisma Community model to Community domain entity.
   *
   * @param prismaCommunity Prisma Community model
   * @returns Community domain entity
   */
  static toDomain(prismaCommunity: PrismaCommunity & { ownerId?: string; primaryColor?: string }): Community {
    // Note: ownerId and primaryColor are not yet in the Prisma schema
    // These fields need to be added to the schema in a future migration
    const ownerId = prismaCommunity.ownerId || ""; // Temporary placeholder
    const primaryColor = prismaCommunity.primaryColor || "#0066CC"; // Default value

    return Community.reconstitute({
      id: prismaCommunity.id,
      name: prismaCommunity.name,
      logoUrl: prismaCommunity.logoUrl,
      primaryColor,
      ownerId,
      createdAt: prismaCommunity.createdAt,
      updatedAt: prismaCommunity.updatedAt,
      deletedAt: prismaCommunity.deletedAt,
    });
  }

  /**
   * Convert Community domain entity to Prisma Community persistence format.
   *
   * @param community Community domain entity
   * @returns Prisma Community create/update input data
   */
  static toPersistence(community: Community): {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logoUrl: string | null;
    darkMode: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    // Note: ownerId and primaryColor will be added once schema is updated
    ownerId?: string;
    primaryColor?: string;
  } {
    // Generate slug from name (simple implementation - should be more sophisticated in production)
    const slug = community
      .getName()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    return {
      id: community.getId(),
      name: community.getName(),
      slug,
      description: null, // Not yet in domain model
      logoUrl: community.getLogoUrl(),
      darkMode: false, // Default value - not yet in domain model
      createdAt: community.getCreatedAt(),
      updatedAt: community.getUpdatedAt(),
      deletedAt: community.getDeletedAt(),
      // Fields to be added when schema is updated:
      ownerId: community.getOwnerId(),
      primaryColor: community.getPrimaryColor(),
    };
  }
}
