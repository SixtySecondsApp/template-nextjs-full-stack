/**
 * Certificate Service
 * Orchestrates PDF generation and S3 upload for certificates
 *
 * This service combines the PDF generator and S3 uploader to provide
 * a complete certificate generation and storage workflow.
 */

import { IPdfGenerator, CertificateData } from "./pdf.port";
import { S3Uploader } from "../storage/s3-uploader";

/**
 * Certificate Service Configuration
 */
export interface CertificateServiceConfig {
  /**
   * Whether to make certificates publicly accessible
   * Default: true (for certificate verification)
   */
  publicAccess?: boolean;

  /**
   * Custom S3 uploader instance (for testing/mocking)
   */
  s3Uploader?: S3Uploader;

  /**
   * Custom PDF generator instance (for testing/mocking)
   */
  pdfGenerator?: IPdfGenerator;
}

/**
 * Certificate Service
 * High-level service for generating and storing certificates
 */
export class CertificateService {
  private pdfGenerator: IPdfGenerator;
  private s3Uploader: S3Uploader;
  private publicAccess: boolean;

  constructor(
    pdfGenerator: IPdfGenerator,
    s3Uploader: S3Uploader,
    config: CertificateServiceConfig = {}
  ) {
    this.pdfGenerator = pdfGenerator;
    this.s3Uploader = s3Uploader;
    this.publicAccess = config.publicAccess ?? true;
  }

  /**
   * Generate certificate PDF and upload to S3
   *
   * Complete workflow:
   * 1. Generate PDF from certificate data
   * 2. Upload PDF to S3 storage
   * 3. Return public URL for verification
   *
   * @param data Certificate data to include in PDF
   * @param certificateId Unique certificate identifier (for file naming)
   * @returns Public URL to the uploaded certificate
   * @throws Error if generation or upload fails
   */
  async generateAndUploadCertificate(
    data: CertificateData,
    certificateId: string
  ): Promise<string> {
    try {
      // Step 1: Generate PDF buffer
      const pdfBuffer = await this.pdfGenerator.generateCertificate(data);

      // Step 2: Create unique file name
      // Format: {certificateId}_{verificationCode}.pdf
      // This ensures uniqueness and allows verification lookup
      const fileName = this.generateFileName(certificateId, data.verificationCode);

      // Step 3: Upload to S3
      const pdfUrl = this.publicAccess
        ? await this.s3Uploader.uploadPdf(pdfBuffer, fileName)
        : await this.s3Uploader.uploadPdfWithAcl(pdfBuffer, fileName, false);

      return pdfUrl;
    } catch (error) {
      throw new Error(
        `Failed to generate and upload certificate: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Generate certificate PDF only (no upload)
   * Useful for previews, local testing, or alternative storage
   *
   * @param data Certificate data to include in PDF
   * @returns PDF buffer
   */
  async generateCertificateOnly(data: CertificateData): Promise<Buffer> {
    try {
      return await this.pdfGenerator.generateCertificate(data);
    } catch (error) {
      throw new Error(
        `Failed to generate certificate: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Generate file name for certificate
   * Format: {certificateId}_{verificationCode}.pdf
   *
   * @param certificateId Unique certificate identifier
   * @param verificationCode Verification code for authenticity
   * @returns Sanitised file name
   */
  private generateFileName(
    certificateId: string,
    verificationCode: string
  ): string {
    // Sanitise inputs to prevent path traversal or invalid characters
    const sanitisedId = this.sanitiseFileName(certificateId);
    const sanitisedCode = this.sanitiseFileName(verificationCode);

    return `${sanitisedId}_${sanitisedCode}.pdf`;
  }

  /**
   * Sanitise file name component
   * Removes/replaces characters that might cause issues
   *
   * @param input Raw file name component
   * @returns Sanitised file name component
   */
  private sanitiseFileName(input: string): string {
    return input
      .replace(/[^a-zA-Z0-9-_]/g, "-") // Replace invalid chars with hyphens
      .replace(/-+/g, "-") // Collapse multiple hyphens
      .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
      .toLowerCase(); // Normalise to lowercase
  }
}
