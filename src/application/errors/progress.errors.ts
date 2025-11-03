/**
 * CourseProgress Use Case Error Enums
 * Defines all error types for course progress operations
 * Controllers map these to appropriate HTTP status codes
 */

/**
 * CourseProgress error types for use case operations
 * Maps to HTTP status codes in API routes:
 * - 400: Validation errors (INVALID_*)
 * - 404: Not found errors (*_NOT_FOUND)
 * - 409: Conflict errors (ALREADY_*, CANNOT_*)
 * - 500: Internal server errors
 */
export enum ProgressError {
  // Validation errors (400)
  INVALID_INPUT = "INVALID_INPUT",
  INVALID_LESSON_ID = "INVALID_LESSON_ID",

  // Not found errors (404)
  PROGRESS_NOT_FOUND = "PROGRESS_NOT_FOUND",
  COURSE_NOT_FOUND = "COURSE_NOT_FOUND",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  LESSON_NOT_FOUND = "LESSON_NOT_FOUND",

  // Conflict errors (409)
  LESSON_ALREADY_COMPLETED = "LESSON_ALREADY_COMPLETED",
  LESSON_NOT_AVAILABLE = "LESSON_NOT_AVAILABLE",
  COURSE_ALREADY_COMPLETED = "COURSE_ALREADY_COMPLETED",

  // Server errors (500)
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}
