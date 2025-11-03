/**
 * Restore Comment Version Use Case
 * Restores a comment to a previous version and creates a new version snapshot
 */

import { ICommentRepository, IContentVersionRepository } from '@/ports/repositories';
import { CommentDto } from '@/application/dtos/comment.dto';
import { CommentDtoMapper } from '@/application/mappers/comment-dto.mapper';
import { ContentVersionError } from '@/application/errors/content-version.errors';
import { CommentError } from '@/application/errors/comment.errors';

export class RestoreCommentVersionUseCase {
  constructor(
    private readonly commentRepository: ICommentRepository,
    private readonly versionRepository: IContentVersionRepository
  ) {}

  async execute(commentId: string, versionNumber: number): Promise<CommentDto> {
    try {
      // 1. Validate input
      if (!commentId || commentId.trim().length === 0 || versionNumber < 1) {
        throw new Error(ContentVersionError.INVALID_INPUT);
      }

      // 2. Get target version to restore
      const version = await this.versionRepository.findByContentIdAndVersion(
        commentId,
        versionNumber
      );

      if (!version) {
        throw new Error(ContentVersionError.VERSION_NOT_FOUND);
      }

      // 3. Get current comment
      const comment = await this.commentRepository.findById(commentId);

      if (!comment) {
        throw new Error(CommentError.COMMENT_NOT_FOUND);
      }

      // 4. Get latest version number to check if restoring current version
      const latestVersion = await this.versionRepository.getLatestVersion(commentId);

      if (latestVersion && latestVersion.getVersionNumber() === versionNumber) {
        throw new Error(ContentVersionError.CANNOT_RESTORE_CURRENT_VERSION);
      }

      // 5. Update comment with version content
      comment.update({ content: version.getContent() });
      const updated = await this.commentRepository.update(comment);

      // 6. Create new version snapshot (version number = latest + 1)
      const newVersionNumber = latestVersion ? latestVersion.getVersionNumber() + 1 : 1;
      const newVersion = updated.createVersionSnapshot(newVersionNumber);
      await this.versionRepository.create(newVersion);

      return CommentDtoMapper.toDto(updated);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('VERSION') || error.message.includes('COMMENT')) {
          throw error;
        }
      }
      throw new Error(ContentVersionError.INTERNAL_SERVER_ERROR);
    }
  }
}
