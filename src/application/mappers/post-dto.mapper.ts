/**
 * Post DTO Mapper
 * Converts between Domain Post entities and PostDto
 * Maintains strict boundary between application and domain layers
 */

import { Post } from "@/domain/post/post.entity";
import { PostDto } from "@/application/dtos/post.dto";

export class PostDtoMapper {
  /**
   * Convert Post domain entity to PostDto
   * @param post Domain Post entity
   * @returns PostDto for API responses
   */
  static toDto(post: Post): PostDto {
    return {
      id: post.getId(),
      communityId: post.getCommunityId(),
      authorId: post.getAuthorId(),
      title: post.getTitle(),
      content: post.getContent(),
      isPinned: post.getIsPinned(),
      isSolved: post.getIsSolved(),
      likeCount: post.getLikeCount(),
      helpfulCount: post.getHelpfulCount(),
      commentCount: post.getCommentCount(),
      viewCount: post.getViewCount(),
      createdAt: post.getCreatedAt(),
      updatedAt: post.getUpdatedAt(),
      publishedAt: post.getPublishedAt(),
      isArchived: post.getDeletedAt() !== null,
    };
  }

  /**
   * Convert array of Post entities to array of PostDtos
   * @param posts Array of domain Post entities
   * @returns Array of PostDto for API responses
   */
  static toDtoArray(posts: Post[]): PostDto[] {
    return posts.map((post) => this.toDto(post));
  }
}
