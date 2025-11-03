/**
 * Generate Certificate Use Case
 * Generates a certificate for course completion
 * Verifies course is completed before generation
 */

import {
  ICertificateRepository,
  ICourseProgressRepository,
  ICourseRepository,
  IUserRepository,
  IPdfGenerator,
} from "@/ports/repositories";
import {
  GenerateCertificateDto,
  CertificateDto,
} from "@/application/dtos/certificate.dto";
import { CertificateDtoMapper } from "@/application/mappers/certificate-dto.mapper";
import { CertificateError } from "@/application/errors/certificate.errors";

export class GenerateCertificateUseCase {
  constructor(
    private certificateRepository: ICertificateRepository,
    private progressRepository: ICourseProgressRepository,
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository,
    private pdfGenerator: IPdfGenerator
  ) {}

  /**
   * Execute generate certificate operation
   * @param input GenerateCertificateDto with userId and courseId
   * @returns CertificateDto with PDF URL and verification code
   * @throws Error with CertificateError enum values
   */
  async execute(input: GenerateCertificateDto): Promise<CertificateDto> {
    try {
      // Verify course exists
      const course = await this.courseRepository.findById(input.courseId);
      if (!course) {
        throw new Error(CertificateError.COURSE_NOT_FOUND);
      }

      // Verify user exists
      const user = await this.userRepository.findById(input.userId);
      if (!user) {
        throw new Error(CertificateError.USER_NOT_FOUND);
      }

      // Verify course is completed
      const progress = await this.progressRepository.findByUserIdAndCourseId(
        input.userId,
        input.courseId
      );
      if (!progress || !progress.getCompletedAt()) {
        throw new Error(CertificateError.COURSE_NOT_COMPLETED);
      }

      // Check if certificate already exists
      const existingCert =
        await this.certificateRepository.findByUserIdAndCourseId(
          input.userId,
          input.courseId
        );
      if (existingCert) {
        throw new Error(CertificateError.CERTIFICATE_ALREADY_EXISTS);
      }

      // Fetch instructor
      const instructor = await this.userRepository.findById(
        course.getInstructorId()
      );
      const instructorName = instructor?.getName() || "Unknown";

      // Generate unique verification code
      const verificationCode = this.generateVerificationCode();

      // Create Certificate entity (assuming Certificate.create exists)
      // TODO: Replace with actual Certificate entity
      const certificate = {
        getId: () => crypto.randomUUID(),
        getCourseId: () => input.courseId,
        getUserId: () => input.userId,
        getIssuedAt: () => new Date(),
        getPdfUrl: () => null, // Set after PDF generation
        getVerificationCode: () => verificationCode,
      };

      // Generate PDF
      try {
        const pdfUrl = await this.pdfGenerator.generateCertificate({
          userName: user.getName() || "Unknown",
          courseName: course.getTitle(),
          instructorName,
          issuedAt: new Date(),
          verificationCode,
        });

        // Update certificate with PDF URL
        // certificate.setPdfUrl(pdfUrl);
      } catch (pdfError) {
        throw new Error(CertificateError.PDF_GENERATION_FAILED);
      }

      // Persist via repository
      const created = await this.certificateRepository.create(certificate);

      // Return DTO
      return CertificateDtoMapper.toDto(
        created,
        user.getName() || "Unknown",
        course.getTitle(),
        instructorName
      );
    } catch (error) {
      if (error instanceof Error) {
        if (
          Object.values(CertificateError).includes(
            error.message as CertificateError
          )
        ) {
          throw error;
        }
      }
      throw new Error(CertificateError.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Generate unique verification code
   * Format: CERT-XXXXXXXX (8 alphanumeric characters)
   */
  private generateVerificationCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "CERT-";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
