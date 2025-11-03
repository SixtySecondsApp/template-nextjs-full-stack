/**
 * Create Comment With Notifications Use Case
 * Extends CreateCommentUseCase to add notification creation for mentions and replies
 * Orchestrates comment creation and notification generation
 */

import {
  ICommentRepository,
  IPostRepository,
  IUserRepository,
  INotificationRepository,
} from "@/ports/repositories";
import { CreateCommentUseCase } from "./create-comment.usecase";
import { CreateNotificationUseCase } from "../notifications/create-notification.usecase";
import { CreateCommentDto, CommentDto } from "@/application/dtos/comment.dto";
import { NotificationType } from "@/domain/notification/notification.types";
import { IEmailAdapter } from "@/infrastructure/email/ses-adapter";

export class CreateCommentWithNotificationsUseCase {
  private createCommentUseCase: CreateCommentUseCase;
  private createNotificationUseCase: CreateNotificationUseCase;
  private commentRepository: ICommentRepository;
  private postRepository: IPostRepository;

  constructor(
    commentRepository: ICommentRepository,
    postRepository: IPostRepository,
    notificationRepository: INotificationRepository,
    userRepository: IUserRepository,
    emailAdapter: IEmailAdapter
  ) {
    this.commentRepository = commentRepository;
    this.postRepository = postRepository;

    this.createCommentUseCase = new CreateCommentUseCase(
      commentRepository,
      postRepository
    );
    this.createNotificationUseCase = new CreateNotificationUseCase(
      notificationRepository,
      userRepository,
      emailAdapter
    );
  }

  /**
   * Execute create comment with notifications operation
   * Creates comment and sends notifications to:
   * 1. Mentioned users
   * 2. Parent comment author (if reply)
   * 3. Post author (if top-level comment)
   *
   * @param input CreateCommentDto with postId, authorId, optional parentId, and content
   * @returns CommentDto with assigned ID and timestamps
   * @throws Error with CommentError enum values from CreateCommentUseCase
   */
  async execute(input: CreateCommentDto): Promise<CommentDto> {
    // Create comment using existing use case
    const comment = await this.createCommentUseCase.execute(input);

    // Create notifications asynchronously
    this.createCommentNotifications(
      comment.id,
      input.postId,
      input.authorId,
      input.parentId || null,
      comment.content
    ).catch((error) => {
      console.error(
        "[CreateCommentWithNotificationsUseCase] Failed to create notifications:",
        error
      );
    });

    return comment;
  }

  /**
   * Create notifications for comment creation
   * Private helper method run asynchronously
   */
  private async createCommentNotifications(
    commentId: string,
    postId: string,
    authorId: string,
    parentId: string | null,
    content: string
  ): Promise<void> {
    try {
      // Get post to find communityId and post author
      const post = await this.postRepository.findById(postId);
      if (!post) {
        console.error("[CreateCommentWithNotificationsUseCase] Post not found");
        return;
      }

      const communityId = post.getCommunityId();
      const postAuthorId = post.getAuthorId();

      // 1. Create notifications for mentioned users
      await this.createMentionNotifications(
        commentId,
        communityId,
        postId,
        authorId,
        content
      );

      // 2. Create notification for parent comment author (if reply)
      if (parentId) {
        await this.createReplyNotification(
          commentId,
          communityId,
          postId,
          parentId,
          authorId
        );
      } else {
        // 3. Create notification for post author (if top-level comment)
        await this.createCommentOnPostNotification(
          commentId,
          communityId,
          postId,
          postAuthorId,
          authorId
        );
      }
    } catch (error) {
      console.error(
        "[CreateCommentWithNotificationsUseCase] Error in createCommentNotifications:",
        error
      );
    }
  }

  /**
   * Create notifications for mentioned users in comment
   */
  private async createMentionNotifications(
    commentId: string,
    communityId: string,
    postId: string,
    authorId: string,
    content: string
  ): Promise<void> {
    const mentionedUserIds = this.extractMentions(content);

    for (const userId of mentionedUserIds) {
      if (userId === authorId) {
        continue; // Don't notify author of their own comment
      }

      try {
        await this.createNotificationUseCase.execute({
          userId,
          communityId,
          type: NotificationType.MENTION,
          message: "You were mentioned in a comment",
          linkUrl: `/communities/${communityId}/posts/${postId}#comment-${commentId}`,
          actorId: authorId,
        });
      } catch (error) {
        console.error(
          `[CreateCommentWithNotificationsUseCase] Failed to create mention notification for user ${userId}:`,
          error
        );
      }
    }
  }

  /**
   * Create notification for parent comment author (reply notification)
   */
  private async createReplyNotification(
    commentId: string,
    communityId: string,
    postId: string,
    parentId: string,
    authorId: string
  ): Promise<void> {
    try {
      const parentComment = await this.commentRepository.findById(parentId);
      if (!parentComment) {
        return;
      }

      const parentAuthorId = parentComment.getAuthorId();
      if (parentAuthorId === authorId) {
        return; // Don't notify author of reply to their own comment
      }

      await this.createNotificationUseCase.execute({
        userId: parentAuthorId,
        communityId,
        type: NotificationType.REPLY,
        message: "Someone replied to your comment",
        linkUrl: `/communities/${communityId}/posts/${postId}#comment-${commentId}`,
        actorId: authorId,
      });
    } catch (error) {
      console.error(
        "[CreateCommentWithNotificationsUseCase] Failed to create reply notification:",
        error
      );
    }
  }

  /**
   * Create notification for post author (new comment notification)
   */
  private async createCommentOnPostNotification(
    commentId: string,
    communityId: string,
    postId: string,
    postAuthorId: string,
    commentAuthorId: string
  ): Promise<void> {
    if (postAuthorId === commentAuthorId) {
      return; // Don't notify post author of their own comment
    }

    try {
      await this.createNotificationUseCase.execute({
        userId: postAuthorId,
        communityId,
        type: NotificationType.COMMENT_ON_POST,
        message: "Someone commented on your post",
        linkUrl: `/communities/${communityId}/posts/${postId}#comment-${commentId}`,
        actorId: commentAuthorId,
      });
    } catch (error) {
      console.error(
        "[CreateCommentWithNotificationsUseCase] Failed to create comment on post notification:",
        error
      );
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
