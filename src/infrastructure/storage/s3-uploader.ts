/**
 * S3 Uploader Implementation
 * Handles uploading PDF certificates to AWS S3 storage
 *
 * Configuration via environment variables:
 * - AWS_REGION: AWS region (default: us-east-1)
 * - AWS_ACCESS_KEY_ID: AWS access key
 * - AWS_SECRET_ACCESS_KEY: AWS secret key
 * - AWS_S3_BUCKET: S3 bucket name (default: sixty-community-certificates)
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * S3 Storage Adapter
 * Provides file upload capabilities for certificate PDFs
 */
export class S3Uploader {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    // Validate required environment variables
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error(
        "AWS credentials not configured. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables."
      );
    }

    // Initialise S3 client with credentials
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    // Set bucket name from environment or use default
    this.bucketName =
      process.env.AWS_S3_BUCKET || "sixty-community-certificates";
  }

  /**
   * Upload PDF buffer to S3
   *
   * @param buffer PDF file buffer to upload
   * @param fileName Desired file name (will be prefixed with 'certificates/')
   * @returns Public URL to the uploaded file
   * @throws Error if upload fails
   */
  async uploadPdf(buffer: Buffer, fileName: string): Promise<string> {
    try {
      // S3 key with certificates prefix for organisation
      const key = `certificates/${fileName}`;

      // Prepare upload command
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: "application/pdf",
        // Public read access for certificate verification
        // Note: In production, consider signed URLs for better security
        ACL: "public-read",
        // Cache control for certificate immutability
        CacheControl: "public, max-age=31536000, immutable",
        // Metadata for tracking
        Metadata: {
          uploadedAt: new Date().toISOString(),
          contentType: "certificate",
        },
      });

      // Execute upload
      await this.s3Client.send(command);

      // Return public URL
      // Format: https://{bucket}.s3.{region}.amazonaws.com/{key}
      const region = process.env.AWS_REGION || "us-east-1";
      return `https://${this.bucketName}.s3.${region}.amazonaws.com/${key}`;
    } catch (error) {
      // Wrap S3 errors with context
      throw new Error(
        `Failed to upload PDF to S3: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Upload PDF with custom ACL (for non-public certificates)
   *
   * @param buffer PDF file buffer to upload
   * @param fileName Desired file name
   * @param isPublic Whether certificate should be publicly accessible
   * @returns Public URL or S3 URI depending on ACL
   */
  async uploadPdfWithAcl(
    buffer: Buffer,
    fileName: string,
    isPublic: boolean = true
  ): Promise<string> {
    try {
      const key = `certificates/${fileName}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: "application/pdf",
        ACL: isPublic ? "public-read" : "private",
        CacheControl: isPublic
          ? "public, max-age=31536000, immutable"
          : "private, no-cache",
        Metadata: {
          uploadedAt: new Date().toISOString(),
          contentType: "certificate",
          visibility: isPublic ? "public" : "private",
        },
      });

      await this.s3Client.send(command);

      const region = process.env.AWS_REGION || "us-east-1";

      // Return appropriate URL based on visibility
      if (isPublic) {
        return `https://${this.bucketName}.s3.${region}.amazonaws.com/${key}`;
      } else {
        // Private certificates need signed URLs (not implemented in V1)
        return `s3://${this.bucketName}/${key}`;
      }
    } catch (error) {
      throw new Error(
        `Failed to upload PDF to S3: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}
