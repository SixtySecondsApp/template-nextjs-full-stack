/**
 * IPdfGenerator Interface
 * Defines contract for PDF generation operations
 *
 * Part of the Ports layer - infrastructure implementations must satisfy this interface.
 */

/**
 * Certificate data structure for PDF generation
 */
export interface CertificateData {
  /**
   * Full name of the certificate recipient
   */
  userName: string;

  /**
   * Name of the course or program completed
   */
  courseName: string;

  /**
   * Name of the instructor or facilitator
   */
  instructorName: string;

  /**
   * Date when the certificate was issued
   */
  issuedAt: Date;

  /**
   * Unique verification code for certificate authenticity
   */
  verificationCode: string;
}

/**
 * PDF Generator Port Interface
 * Defines operations for generating PDF certificates
 */
export interface IPdfGenerator {
  /**
   * Generate a certificate as a PDF buffer
   * @param data Certificate data to include in the PDF
   * @returns Promise resolving to PDF buffer
   */
  generateCertificate(data: CertificateData): Promise<Buffer>;

  /**
   * Save certificate directly to file (mainly for testing/development)
   * @param data Certificate data to include in the PDF
   * @param filePath Absolute path where PDF should be saved
   * @returns Promise resolving to the file path
   */
  saveCertificateToPdf(
    data: CertificateData,
    filePath: string
  ): Promise<string>;
}
