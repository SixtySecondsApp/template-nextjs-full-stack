/**
 * IEmailAdapter Interface
 * Defines contract for email notification operations
 *
 * Part of the Ports layer - infrastructure implementations must satisfy this interface.
 */
export interface IEmailAdapter {
  /**
   * Send notification when a user is mentioned in a post or comment.
   * @param to Recipient email address
   * @param mentionedBy Name of user who mentioned recipient
   * @param contentUrl URL to the content where mention occurred
   */
  sendMentionNotification(
    to: string,
    mentionedBy: string,
    contentUrl: string
  ): Promise<void>;

  /**
   * Send notification when someone replies to a user's comment.
   * @param to Recipient email address
   * @param repliedBy Name of user who replied
   * @param contentUrl URL to the reply
   */
  sendReplyNotification(
    to: string,
    repliedBy: string,
    contentUrl: string
  ): Promise<void>;

  /**
   * Send notification when a new post is created in a thread user is following.
   * @param to Recipient email address
   * @param author Name of post author
   * @param postUrl URL to the new post
   */
  sendNewPostNotification(
    to: string,
    author: string,
    postUrl: string
  ): Promise<void>;
}
