import { CreateCertificateInput, CertificateData } from "./certificate.types";

/**
 * Certificate entity represents a completion certificate for a course.
 * Follows hexagonal architecture with pure domain logic - NO framework dependencies.
 *
 * Business Rules:
 * - All names (userName, courseName, instructorName) are required and non-empty
 * - Verification code must be unique (8-char alphanumeric)
 * - issuedAt is set on creation and cannot be modified
 * - pdfUrl is set after PDF generation by infrastructure
 * - Certificates are immutable once issued (no updates allowed)
 */
export class Certificate {
  private constructor(
    private readonly id: string,
    private readonly courseId: string,
    private readonly userId: string,
    private readonly userName: string,
    private readonly courseName: string,
    private readonly instructorName: string,
    private readonly issuedAt: Date,
    private pdfUrl: string | null,
    private readonly verificationCode: string
  ) {
    this.validateName(userName, "User name");
    this.validateName(courseName, "Course name");
    this.validateName(instructorName, "Instructor name");
    this.validateVerificationCode(verificationCode);
  }

  /**
   * Factory method to create a new Certificate entity.
   * Certificate is issued immediately with current timestamp.
   */
  static create(input: CreateCertificateInput): Certificate {
    return new Certificate(
      input.id,
      input.courseId,
      input.userId,
      input.userName,
      input.courseName,
      input.instructorName,
      new Date(), // issuedAt
      null, // pdfUrl (set after generation)
      input.verificationCode
    );
  }

  /**
   * Factory method to reconstitute a Certificate entity from persistence.
   */
  static reconstitute(data: CertificateData): Certificate {
    return new Certificate(
      data.id,
      data.courseId,
      data.userId,
      data.userName,
      data.courseName,
      data.instructorName,
      data.issuedAt,
      data.pdfUrl,
      data.verificationCode
    );
  }

  // Getters

  getId(): string {
    return this.id;
  }

  getCourseId(): string {
    return this.courseId;
  }

  getUserId(): string {
    return this.userId;
  }

  getUserName(): string {
    return this.userName;
  }

  getCourseName(): string {
    return this.courseName;
  }

  getInstructorName(): string {
    return this.instructorName;
  }

  getIssuedAt(): Date {
    return this.issuedAt;
  }

  getPdfUrl(): string | null {
    return this.pdfUrl;
  }

  getVerificationCode(): string {
    return this.verificationCode;
  }

  hasPdf(): boolean {
    return this.pdfUrl !== null;
  }

  // Business logic methods

  /**
   * Set the PDF URL after PDF generation.
   * Can only be set once.
   * @param url - The URL where the certificate PDF is stored
   * @throws Error if PDF URL is already set or URL is invalid
   */
  setPdfUrl(url: string): void {
    if (this.pdfUrl !== null) {
      throw new Error("Certificate PDF URL is already set");
    }

    if (!url || url.trim().length === 0) {
      throw new Error("PDF URL cannot be empty");
    }

    this.validateUrl(url);
    this.pdfUrl = url;
  }

  // Private validation methods

  private validateName(name: string, fieldName: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error(`${fieldName} cannot be empty`);
    }
  }

  private validateVerificationCode(code: string): void {
    if (!code || code.trim().length === 0) {
      throw new Error("Verification code cannot be empty");
    }

    // Must be exactly 8 alphanumeric characters
    const alphanumericPattern = /^[A-Z0-9]{8}$/;

    if (!alphanumericPattern.test(code)) {
      throw new Error(
        "Verification code must be 8 alphanumeric characters (uppercase)"
      );
    }
  }

  private validateUrl(url: string): void {
    try {
      new URL(url);
    } catch {
      throw new Error("PDF URL must be a valid URL");
    }
  }
}
