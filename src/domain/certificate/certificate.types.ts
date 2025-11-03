/**
 * Certificate domain types
 * Type definitions for Certificate entity following hexagonal architecture
 */

export interface CreateCertificateInput {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  courseName: string;
  instructorName: string;
  verificationCode: string;
}

export interface CertificateData {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  courseName: string;
  instructorName: string;
  issuedAt: Date;
  pdfUrl: string | null;
  verificationCode: string;
}
