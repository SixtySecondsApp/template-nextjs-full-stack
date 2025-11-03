/**
 * Restore Post Version Use Case
 * Restores a post to a previous version and creates a new version snapshot
 */

import { IPostRepository, IContentVersionRepository } from '@/ports/repositories';
import { PostDto } from '@/application/dtos/post.dto';
import { PostDtoMapper } from '@/application/mappers/post-dto.mapper';
import { ContentVersionError } from '@/application/errors/content-version.errors';
import { PostError } from '@/application/errors/post.errors';

export class RestorePostVersionUseCase {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly versionRepository: IContentVersionRepository
  ) {}

  async execute(postId: string, versionNumber: number): Promise<PostDto> {
    try {
      // 1. Validate input
      if (!postId || postId.trim().length === 0 || versionNumber < 1) {
        throw new Error(ContentVersionError.INVALID_INPUT);
      }

      // 2. Get target version to restore
      const version = await this.versionRepository.findByContentIdAndVersion(
        postId,
        versionNumber
      );

      if (!version) {
        throw new Error(ContentVersionError.VERSION_NOT_FOUND);
      }

      // 3. Get current post
      const post = await this.postRepository.findById(postId);

      if (!post) {
        throw new Error(PostError.POST_NOT_FOUND);
      }

      // 4. Get latest version number to check if restoring current version
      const latestVersion = await this.versionRepository.getLatestVersion(postId);

      if (latestVersion && latestVersion.getVersionNumber() === versionNumber) {
        throw new Error(ContentVersionError.CANNOT_RESTORE_CURRENT_VERSION);
      }

      // 5. Update post with version content
      post.update({ content: version.getContent() });
      const updated = await this.postRepository.update(post);

      // 6. Create new version snapshot (version number = latest + 1)
      const newVersionNumber = latestVersion ? latestVersion.getVersionNumber() + 1 : 1;
      const newVersion = updated.createVersionSnapshot(newVersionNumber);
      await this.versionRepository.create(newVersion);

      return PostDtoMapper.toDto(updated);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('VERSION') || error.message.includes('POST')) {
          throw error;
        }
      }
      throw new Error(ContentVersionError.INTERNAL_SERVER_ERROR);
    }
  }
}
