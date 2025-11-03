/**
 * Get Certificate Use Case
 * Retrieves a certificate by ID
 */

import {
  ICertificateRepository,
  ICourseRepository,
  IUserRepository,
} from "@/ports/repositories";
import { CertificateDto } from "@/application/dtos/certificate.dto";
import { CertificateDtoMapper } from "@/application/mappers/certificate-dto.mapper";
import { CertificateError } from "@/application/errors/certificate.errors";

export class GetCertificateUseCase {
  constructor(
    private certificateRepository: ICertificateRepository,
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Execute get certificate operation
   * @param certificateId Certificate ID
   * @returns CertificateDto with metadata
   * @throws Error with CertificateError.CERTIFICATE_NOT_FOUND
   */
  async execute(certificateId: string): Promise<CertificateDto> {
    try {
      // Find certificate
      const certificate = await this.certificateRepository.findById(
        certificateId
      );
      if (!certificate) {
        throw new Error(CertificateError.CERTIFICATE_NOT_FOUND);
      }

      // Fetch related entities
      const user = await this.userRepository.findById(certificate.getUserId());
      const course = await this.courseRepository.findById(
        certificate.getCourseId()
      );
      const instructor = course
        ? await this.userRepository.findById(course.getInstructorId())
        : null;

      const userName = user?.getName() || "Unknown";
      const courseName = course?.getTitle() || "Unknown";
      const instructorName = instructor?.getName() || "Unknown";

      // Return DTO
      return CertificateDtoMapper.toDto(
        certificate,
        userName,
        courseName,
        instructorName
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === CertificateError.CERTIFICATE_NOT_FOUND) {
          throw error;
        }
      }
      throw new Error(CertificateError.INTERNAL_SERVER_ERROR);
    }
  }
}
