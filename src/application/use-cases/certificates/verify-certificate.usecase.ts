/**
 * Verify Certificate Use Case
 * Verifies a certificate by verification code
 * Public endpoint for certificate validation
 */

import {
  ICertificateRepository,
  ICourseRepository,
  IUserRepository,
} from "@/ports/repositories";
import { VerifyCertificateDto } from "@/application/dtos/certificate.dto";
import { CertificateDtoMapper } from "@/application/mappers/certificate-dto.mapper";
import { CertificateError } from "@/application/errors/certificate.errors";

export class VerifyCertificateUseCase {
  constructor(
    private certificateRepository: ICertificateRepository,
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Execute verify certificate operation
   * @param verificationCode Certificate verification code
   * @returns VerifyCertificateDto with validity status
   */
  async execute(verificationCode: string): Promise<VerifyCertificateDto> {
    try {
      // Find certificate by verification code
      const certificate =
        await this.certificateRepository.findByVerificationCode(
          verificationCode
        );

      if (!certificate) {
        return {
          isValid: false,
          certificate: null,
        };
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

      // Return DTO with valid status
      return {
        isValid: true,
        certificate: CertificateDtoMapper.toDto(
          certificate,
          userName,
          courseName,
          instructorName
        ),
      };
    } catch (error) {
      throw new Error(CertificateError.INTERNAL_SERVER_ERROR);
    }
  }
}
