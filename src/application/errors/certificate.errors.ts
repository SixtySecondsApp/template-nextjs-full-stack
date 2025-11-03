/**
 * Certificate Use Case Error Enums
 * Defines all error types for certificate operations
 * Controllers map these to appropriate HTTP status codes
 */

/**
 * Certificate error types for use case operations
 * Maps to HTTP status codes in API routes:
 * - 400: Validation errors (INVALID_*)
 * - 404: Not found errors (*_NOT_FOUND)
 * - 409: Conflict errors (ALREADY_*, CANNOT_*)
 * - 500: Internal server errors
 */
export enum CertificateError {
  // Validation errors (400)
  INVALID_INPUT = "INVALID_INPUT",
  INVALID_VERIFICATION_CODE = "INVALID_VERIFICATION_CODE",

  // Not found errors (404)
  CERTIFICATE_NOT_FOUND = "CERTIFICATE_NOT_FOUND",
  COURSE_NOT_FOUND = "COURSE_NOT_FOUND",
  USER_NOT_FOUND = "USER_NOT_FOUND",

  // Conflict errors (409)
  CERTIFICATE_ALREADY_EXISTS = "CERTIFICATE_ALREADY_EXISTS",
  COURSE_NOT_COMPLETED = "COURSE_NOT_COMPLETED",
  PDF_GENERATION_FAILED = "PDF_GENERATION_FAILED",

  // Server errors (500)
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}
