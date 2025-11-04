import { PrismaClient } from "@/generated/prisma";
import { PostAttachment } from "@/domain/post/post-attachment.vo";
import { IPostAttachmentRepository } from "@/application/ports/post-attachment-repository.interface";
import { PostAttachmentPrismaMapper } from "@/infrastructure/mappers/post-attachment-prisma.mapper";

/**
 * PostAttachmentRepositoryPrisma - Prisma implementation of IPostAttachmentRepository.
 * Handles PostAttachment persistence using Prisma ORM.
 *
 * Key responsibilities:
 * - Implement repository interface using Prisma
 * - Enforce soft delete filters (deletedAt = null)
 * - Map between domain value objects and Prisma models
 * - Handle database errors gracefully
 */
export class PostAttachmentRepositoryPrisma
  implements IPostAttachmentRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async create(attachment: PostAttachment): Promise<PostAttachment> {
    try {
      const persistenceData =
        PostAttachmentPrismaMapper.toPrismaCreate(attachment);

      const created = await this.prisma.postAttachment.create({
        data: persistenceData,
      });

      return PostAttachmentPrismaMapper.toDomain(created);
    } catch (error) {
      throw new Error(
        `Failed to create attachment: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async findByPost(postId: string): Promise<PostAttachment[]> {
    try {
      const results = await this.prisma.postAttachment.findMany({
        where: {
          postId,
          deletedAt: null, // Soft delete filter
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return results.map(PostAttachmentPrismaMapper.toDomain);
    } catch (error) {
      throw new Error(
        `Failed to find attachments by post: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async findById(id: string): Promise<PostAttachment | null> {
    try {
      const result = await this.prisma.postAttachment.findFirst({
        where: {
          id,
          deletedAt: null, // Soft delete filter
        },
      });

      return result ? PostAttachmentPrismaMapper.toDomain(result) : null;
    } catch (error) {
      throw new Error(
        `Failed to find attachment by ID: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.postAttachment.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      throw new Error(
        `Failed to soft delete attachment: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async restore(id: string): Promise<void> {
    try {
      await this.prisma.postAttachment.update({
        where: { id },
        data: { deletedAt: null },
      });
    } catch (error) {
      throw new Error(
        `Failed to restore attachment: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}
