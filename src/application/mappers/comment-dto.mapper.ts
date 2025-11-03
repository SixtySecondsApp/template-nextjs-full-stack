/**
 * Comment DTO Mapper
 * Converts between Domain Comment entities and CommentDto
 * Maintains strict boundary between application and domain layers
 */

import { Comment } from "@/domain/comment/comment.entity";
import { CommentDto } from "@/application/dtos/comment.dto";

export class CommentDtoMapper {
  /**
   * Convert Comment domain entity to CommentDto
   * @param comment Domain Comment entity
   * @returns CommentDto for API responses
   */
  static toDto(comment: Comment): CommentDto {
    return {
      id: comment.getId(),
      postId: comment.getPostId(),
      authorId: comment.getAuthorId(),
      parentId: comment.getParentId(),
      content: comment.getContent(),
      likeCount: comment.getLikeCount(),
      helpfulCount: comment.getHelpfulCount(),
      createdAt: comment.getCreatedAt(),
      updatedAt: comment.getUpdatedAt(),
      isArchived: comment.getDeletedAt() !== null,
    };
  }

  /**
   * Convert array of Comment entities to array of CommentDtos
   * @param comments Array of domain Comment entities
   * @returns Array of CommentDto for API responses
   */
  static toDtoArray(comments: Comment[]): CommentDto[] {
    return comments.map((comment) => this.toDto(comment));
  }

  /**
   * Build hierarchical comment tree from flat list
   * Organises comments with replies nested under parents
   * @param comments Flat array of Comment entities
   * @returns Array of top-level CommentDto with nested replies
   */
  static toDtoTree(comments: Comment[]): CommentDto[] {
    const dtos = this.toDtoArray(comments);
    const commentMap = new Map<string, CommentDto>();
    const rootComments: CommentDto[] = [];

    // First pass: create map of all comments
    dtos.forEach((dto) => {
      commentMap.set(dto.id, { ...dto, replies: [] });
    });

    // Second pass: build hierarchy
    commentMap.forEach((dto) => {
      if (dto.parentId === null) {
        // Top-level comment
        rootComments.push(dto);
      } else {
        // Nested reply - attach to parent
        const parent = commentMap.get(dto.parentId);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(dto);
        }
      }
    });

    return rootComments;
  }
}
