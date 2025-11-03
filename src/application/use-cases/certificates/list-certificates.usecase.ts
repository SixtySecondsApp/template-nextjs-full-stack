/**
 * List Certificates Use Case
 * Lists all certificates for a user
 */

import {
  ICertificateRepository,
  ICourseRepository,
  IUserRepository,
} from "@/ports/repositories";
import { CertificateDto } from "@/application/dtos/certificate.dto";
import { CertificateDtoMapper } from "@/application/mappers/certificate-dto.mapper";
import { CertificateError } from "@/application/errors/certificate.errors";

export class ListCertificatesUseCase {
  constructor(
    private certificateRepository: ICertificateRepository,
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Execute list certificates operation
   * @param userId User ID
   * @returns Array of CertificateDto
   */
  async execute(userId: string): Promise<CertificateDto[]> {
    try {
      // Find all certificates for user
      const certificates = await this.certificateRepository.findByUserId(
        userId
      );

      // Build DTOs with metadata
      const certificateDtos = await Promise.all(
        certificates.map(async (certificate) => {
          const user = await this.userRepository.findById(userId);
          const course = await this.courseRepository.findById(
            certificate.getCourseId()
          );
          const instructor = course
            ? await this.userRepository.findById(course.getInstructorId())
            : null;

          const userName = user?.getName() || "Unknown";
          const courseName = course?.getTitle() || "Unknown";
          const instructorName = instructor?.getName() || "Unknown";

          return CertificateDtoMapper.toDto(
            certificate,
            userName,
            courseName,
            instructorName
          );
        })
      );

      return certificateDtos;
    } catch (error) {
      throw new Error(CertificateError.INTERNAL_SERVER_ERROR);
    }
  }
}
