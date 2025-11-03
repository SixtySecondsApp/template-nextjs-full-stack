import { IEmailAdapter } from "./email.port";

/**
 * SESAdapter
 * AWS Simple Email Service (SES) adapter for sending email notifications.
 *
 * Part of the Infrastructure layer - provides email capabilities via AWS SES.
 *
 * Key responsibilities:
 * - Send transactional emails (mentions, replies, new posts)
 * - Generate HTML email templates with proper formatting
 * - Handle AWS SES API integration
 * - Log email operations for debugging
 * - Handle errors gracefully (email failures shouldn't break app)
 *
 * V1 Implementation:
 * - Console logging only (AWS SES deferred to post-MVP)
 * - Email notifications are optional in V1
 * - Template structure defined for future AWS SES integration
 *
 * Future AWS SES integration (V1.1):
 * ```typescript
 * import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
 *
 * const sesClient = new SESClient({
 *   region: process.env.AWS_REGION || 'us-east-1',
 *   credentials: {
 *     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
 *     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
 *   },
 * });
 *
 * const command = new SendEmailCommand({
 *   Source: process.env.SES_FROM_EMAIL || 'noreply@sixtycommunity.com',
 *   Destination: {
 *     ToAddresses: [to],
 *   },
 *   Message: {
 *     Subject: {
 *       Data: subject,
 *       Charset: 'UTF-8',
 *     },
 *     Body: {
 *       Html: {
 *         Data: htmlBody,
 *         Charset: 'UTF-8',
 *       },
 *     },
 *   },
 * });
 *
 * await sesClient.send(command);
 * ```
 *
 * Required environment variables (V1.1):
 * - AWS_REGION: AWS region (e.g., 'us-east-1')
 * - AWS_ACCESS_KEY_ID: AWS IAM access key
 * - AWS_SECRET_ACCESS_KEY: AWS IAM secret key
 * - SES_FROM_EMAIL: Verified sender email address
 *
 * Error handling:
 * - All errors are logged but not thrown (email is non-critical)
 * - Failed sends logged for manual retry if needed
 * - Graceful degradation when SES unavailable
 */
export class SESAdapter implements IEmailAdapter {
  private readonly fromEmail = process.env.SES_FROM_EMAIL || "noreply@sixtycommunity.com";
  private readonly baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  /**
   * Send notification when a user is mentioned.
   * @param to Recipient email address
   * @param mentionedBy Name of user who mentioned recipient
   * @param contentUrl URL to the content (relative path)
   */
  async sendMentionNotification(
    to: string,
    mentionedBy: string,
    contentUrl: string
  ): Promise<void> {
    try {
      const subject = `${mentionedBy} mentioned you`;
      const htmlBody = this.generateMentionEmail(mentionedBy, contentUrl);

      await this.sendEmail(to, subject, htmlBody);
    } catch (error) {
      // Log error but don't throw - email failures shouldn't break the app
      console.error("Failed to send mention notification:", error);
    }
  }

  /**
   * Send notification when someone replies to a user's comment.
   * @param to Recipient email address
   * @param repliedBy Name of user who replied
   * @param contentUrl URL to the reply (relative path)
   */
  async sendReplyNotification(
    to: string,
    repliedBy: string,
    contentUrl: string
  ): Promise<void> {
    try {
      const subject = `${repliedBy} replied to your comment`;
      const htmlBody = this.generateReplyEmail(repliedBy, contentUrl);

      await this.sendEmail(to, subject, htmlBody);
    } catch (error) {
      console.error("Failed to send reply notification:", error);
    }
  }

  /**
   * Send notification when a new post is created.
   * @param to Recipient email address
   * @param author Name of post author
   * @param postUrl URL to the new post (relative path)
   */
  async sendNewPostNotification(
    to: string,
    author: string,
    postUrl: string
  ): Promise<void> {
    try {
      const subject = `${author} posted in a thread you're following`;
      const htmlBody = this.generateNewPostEmail(author, postUrl);

      await this.sendEmail(to, subject, htmlBody);
    } catch (error) {
      console.error("Failed to send new post notification:", error);
    }
  }

  /**
   * Core email sending method.
   * V1: Logs to console. V1.1: AWS SES integration.
   */
  private async sendEmail(
    to: string,
    subject: string,
    htmlBody: string
  ): Promise<void> {
    // V1 MVP: Console logging only
    console.log(`[Email] To: ${to}`);
    console.log(`[Email] Subject: ${subject}`);
    console.log(`[Email] Body: ${htmlBody.substring(0, 200)}...`);

    // TODO V1.1: Implement AWS SES integration
    // const sesClient = new SESClient({
    //   region: process.env.AWS_REGION || 'us-east-1',
    //   credentials: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    //   },
    // });
    //
    // const command = new SendEmailCommand({
    //   Source: this.fromEmail,
    //   Destination: {
    //     ToAddresses: [to],
    //   },
    //   Message: {
    //     Subject: {
    //       Data: subject,
    //       Charset: 'UTF-8',
    //     },
    //     Body: {
    //       Html: {
    //         Data: htmlBody,
    //         Charset: 'UTF-8',
    //       },
    //     },
    //   },
    // });
    //
    // await sesClient.send(command);

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  /**
   * Generate HTML email for mention notification.
   */
  private generateMentionEmail(
    mentionedBy: string,
    contentUrl: string
  ): string {
    const fullUrl = `${this.baseUrl}${contentUrl}`;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You were mentioned</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
    <h2 style="color: #2563eb; margin-top: 0;">You were mentioned!</h2>
    <p style="font-size: 16px;">
      <strong>${mentionedBy}</strong> mentioned you in a post.
    </p>
    <p style="margin: 30px 0;">
      <a href="${fullUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
        View Post
      </a>
    </p>
    <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
    <p style="font-size: 12px; color: #6c757d;">
      You're receiving this email because you're a member of Sixty Community.
      <a href="${this.baseUrl}/settings/notifications" style="color: #2563eb; text-decoration: none;">Manage notification preferences</a>
    </p>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Generate HTML email for reply notification.
   */
  private generateReplyEmail(repliedBy: string, contentUrl: string): string {
    const fullUrl = `${this.baseUrl}${contentUrl}`;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New reply to your comment</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
    <h2 style="color: #2563eb; margin-top: 0;">New reply to your comment</h2>
    <p style="font-size: 16px;">
      <strong>${repliedBy}</strong> replied to your comment.
    </p>
    <p style="margin: 30px 0;">
      <a href="${fullUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
        View Reply
      </a>
    </p>
    <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
    <p style="font-size: 12px; color: #6c757d;">
      You're receiving this email because you're a member of Sixty Community.
      <a href="${this.baseUrl}/settings/notifications" style="color: #2563eb; text-decoration: none;">Manage notification preferences</a>
    </p>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Generate HTML email for new post notification.
   */
  private generateNewPostEmail(author: string, postUrl: string): string {
    const fullUrl = `${this.baseUrl}${postUrl}`;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New post in thread you're following</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
    <h2 style="color: #2563eb; margin-top: 0;">New post in thread you're following</h2>
    <p style="font-size: 16px;">
      <strong>${author}</strong> posted in a thread you're following.
    </p>
    <p style="margin: 30px 0;">
      <a href="${fullUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
        View Post
      </a>
    </p>
    <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
    <p style="font-size: 12px; color: #6c757d;">
      You're receiving this email because you're a member of Sixty Community.
      <a href="${this.baseUrl}/settings/notifications" style="color: #2563eb; text-decoration: none;">Manage notification preferences</a>
    </p>
  </div>
</body>
</html>
    `.trim();
  }
}
