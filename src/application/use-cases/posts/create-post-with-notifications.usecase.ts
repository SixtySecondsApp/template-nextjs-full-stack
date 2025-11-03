/**
 * Create Post With Notifications Use Case
 * Extends CreatePostUseCase to add notification creation for mentions
 * Orchestrates post creation and notification generation
 */

import { IPostRepository, IUserRepository } from "@/ports/repositories";
import { CreatePostUseCase } from "./create-post.usecase";
import { CreateNotificationUseCase } from "../notifications/create-notification.usecase";
import { CreatePostDto, PostDto } from "@/application/dtos/post.dto";
import { NotificationType } from "@/domain/notification/notification.types";
import { INotificationRepository } from "@/ports/repositories";
import { IEmailAdapter } from "@/infrastructure/email/ses-adapter";

export class CreatePostWithNotificationsUseCase {
  private createPostUseCase: CreatePostUseCase;
  private createNotificationUseCase: CreateNotificationUseCase;

  constructor(
    postRepository: IPostRepository,
    notificationRepository: INotificationRepository,
    userRepository: IUserRepository,
    emailAdapter: IEmailAdapter
  ) {
    this.createPostUseCase = new CreatePostUseCase(postRepository);
    this.createNotificationUseCase = new CreateNotificationUseCase(
      notificationRepository,
      userRepository,
      emailAdapter
    );
  }

  /**
   * Execute create post with notifications operation
   * Creates post and sends notifications to mentioned users
   *
   * @param input CreatePostDto with required fields
   * @returns PostDto with assigned ID and timestamps
   * @throws Error with PostError enum values from CreatePostUseCase
   */
  async execute(input: CreatePostDto): Promise<PostDto> {
    // Create post using existing use case
    const post = await this.createPostUseCase.execute(input);

    // Extract mentions from content asynchronously
    this.createMentionNotifications(
      post.id,
      post.communityId,
      post.authorId,
      post.content
    ).catch((error) => {
      console.error(
        "[CreatePostWithNotificationsUseCase] Failed to create mention notifications:",
        error
      );
    });

    return post;
  }

  /**
   * Create notifications for mentioned users
   * Private helper method run asynchronously
   */
  private async createMentionNotifications(
    postId: string,
    communityId: string,
    authorId: string,
    content: string
  ): Promise<void> {
    // Extract mentions from content using same pattern as Post entity
    const mentionedUserIds = this.extractMentions(content);

    // Create notification for each mentioned user (excluding post author)
    for (const userId of mentionedUserIds) {
      if (userId === authorId) {
        continue; // Don't notify author of their own post
      }

      try {
        await this.createNotificationUseCase.execute({
          userId,
          communityId,
          type: NotificationType.MENTION,
          message: "You were mentioned in a post",
          linkUrl: `/communities/${communityId}/posts/${postId}`,
          actorId: authorId,
        });
      } catch (error) {
        console.error(
          `[CreatePostWithNotificationsUseCase] Failed to create notification for user ${userId}:`,
          error
        );
      }
    }
  }

  /**
   * Extract user mentions from content
   * Matches Post entity's extractMentions method
   */
  private extractMentions(content: string): string[] {
    if (!content) {
      return [];
    }

    // Pattern: @[userId:userName] or data-mention-id="userId"
    const mentionPattern = /@\[([^:]+):[^\]]+\]/g;
    const dataAttributePattern = /data-mention-id="([^"]+)"/g;

    const userIds = new Set<string>();

    // Extract from @[userId:userName] format
    let match;
    while ((match = mentionPattern.exec(content)) !== null) {
      userIds.add(match[1]);
    }

    // Extract from data-mention-id attribute
    while ((match = dataAttributePattern.exec(content)) !== null) {
      userIds.add(match[1]);
    }

    return Array.from(userIds);
  }
}
