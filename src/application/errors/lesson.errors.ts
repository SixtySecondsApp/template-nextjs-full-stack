/**
 * Lesson Use Case Error Enums
 * Defines all error types for lesson operations
 * Controllers map these to appropriate HTTP status codes
 */

/**
 * Lesson error types for use case operations
 * Maps to HTTP status codes in API routes:
 * - 400: Validation errors (INVALID_*)
 * - 404: Not found errors (*_NOT_FOUND)
 * - 409: Conflict errors (ALREADY_*, CANNOT_*)
 * - 500: Internal server errors
 */
export enum LessonError {
  // Validation errors (400)
  INVALID_INPUT = "INVALID_INPUT",
  INVALID_TITLE = "INVALID_TITLE",
  INVALID_CONTENT = "INVALID_CONTENT",
  INVALID_TYPE = "INVALID_TYPE",
  INVALID_ORDER = "INVALID_ORDER",
  INVALID_DRIP_DATE = "INVALID_DRIP_DATE",
  TITLE_TOO_SHORT = "TITLE_TOO_SHORT",
  TITLE_TOO_LONG = "TITLE_TOO_LONG",
  CONTENT_TOO_SHORT = "CONTENT_TOO_SHORT",
  MISSING_VIDEO_URL = "MISSING_VIDEO_URL",
  MISSING_PDF_URL = "MISSING_PDF_URL",

  // Not found errors (404)
  LESSON_NOT_FOUND = "LESSON_NOT_FOUND",
  COURSE_NOT_FOUND = "COURSE_NOT_FOUND",

  // Conflict errors (409)
  LESSON_ALREADY_ARCHIVED = "LESSON_ALREADY_ARCHIVED",
  CANNOT_MODIFY_ARCHIVED_LESSON = "CANNOT_MODIFY_ARCHIVED_LESSON",
  LESSON_NOT_AVAILABLE = "LESSON_NOT_AVAILABLE",
  DRIP_DATE_IN_PAST = "DRIP_DATE_IN_PAST",

  // Authorization errors (403)
  UNAUTHORIZED = "UNAUTHORIZED",
  NOT_COURSE_INSTRUCTOR = "NOT_COURSE_INSTRUCTOR",

  // Server errors (500)
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}
