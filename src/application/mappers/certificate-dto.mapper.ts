/**
 * Certificate DTO Mapper
 * Converts between Domain Certificate entities and CertificateDto
 * Maintains strict boundary between application and domain layers
 * 
 * Note: This assumes Certificate domain entity exists with proper getters
 * TODO: Update when Certificate entity is implemented
 */

import { CertificateDto } from "@/application/dtos/certificate.dto";

export class CertificateDtoMapper {
  /**
   * Convert Certificate domain entity to CertificateDto
   * @param certificate Domain Certificate entity
   * @param userName User name from User entity
   * @param courseName Course name from Course entity
   * @param instructorName Instructor name from User entity
   * @returns CertificateDto for API responses
   */
  static toDto(
    certificate: any,
    userName: string,
    courseName: string,
    instructorName: string
  ): CertificateDto {
    return {
      id: certificate.getId(),
      courseId: certificate.getCourseId(),
      userId: certificate.getUserId(),
      userName,
      courseName,
      instructorName,
      issuedAt: certificate.getIssuedAt().toISOString(),
      pdfUrl: certificate.getPdfUrl(),
      verificationCode: certificate.getVerificationCode(),
    };
  }

  /**
   * Convert array of Certificate entities to array of CertificateDtos
   * @param certificates Array of domain Certificate entities with metadata
   * @returns Array of CertificateDto for API responses
   */
  static toDtoArray(
    certificates: Array<{
      certificate: any;
      userName: string;
      courseName: string;
      instructorName: string;
    }>
  ): CertificateDto[] {
    return certificates.map((item) =>
      this.toDto(
        item.certificate,
        item.userName,
        item.courseName,
        item.instructorName
      )
    );
  }
}
