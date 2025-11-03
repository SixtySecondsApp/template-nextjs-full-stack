/**
 * Certificate Data Transfer Objects
 * Plain TypeScript interfaces for API communication
 * NO domain logic, NO Prisma types
 */

/**
 * Full Certificate DTO for API responses
 */
export interface CertificateDto {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  courseName: string;
  instructorName: string;
  issuedAt: string; // ISO string
  pdfUrl: string | null;
  verificationCode: string;
}

/**
 * Generate Certificate DTO for API requests
 */
export interface GenerateCertificateDto {
  courseId: string;
  userId: string;
}

/**
 * Verify Certificate DTO for API responses
 */
export interface VerifyCertificateDto {
  isValid: boolean;
  certificate: CertificateDto | null;
}
