import { PostAttachment } from "@/domain/post/post-attachment.vo";
import { PostAttachment as PrismaPostAttachment } from "@/generated/prisma";

/**
 * PostAttachmentPrismaMapper - Maps between Domain PostAttachment VO and Prisma PostAttachment model.
 * Maintains strict type boundaries - NO Prisma types leak into domain/application layers.
 */
export class PostAttachmentPrismaMapper {
  /**
   * Convert Prisma PostAttachment model to Domain PostAttachment value object.
   * @param prismaAttachment - Prisma PostAttachment model from database
   * @returns Domain PostAttachment value object
   */
  static toDomain(prismaAttachment: PrismaPostAttachment): PostAttachment {
    return PostAttachment.reconstitute({
      id: prismaAttachment.id,
      postId: prismaAttachment.postId,
      fileName: prismaAttachment.fileName,
      fileUrl: prismaAttachment.fileUrl,
      fileSize: prismaAttachment.fileSize,
      mimeType: prismaAttachment.mimeType,
      createdAt: prismaAttachment.createdAt,
    });
  }

  /**
   * Convert Domain PostAttachment value object to Prisma create input.
   * Used for creating new attachments in database.
   * @param attachment - Domain PostAttachment value object
   * @returns Prisma PostAttachmentCreateInput
   */
  static toPrismaCreate(attachment: PostAttachment) {
    return {
      id: attachment.getId(),
      postId: attachment.getPostId(),
      fileName: attachment.getFileName(),
      fileUrl: attachment.getFileUrl(),
      fileSize: attachment.getFileSize(),
      mimeType: attachment.getMimeType(),
      createdAt: attachment.getCreatedAt(),
      deletedAt: null,
    };
  }
}
