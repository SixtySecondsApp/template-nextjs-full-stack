/**
 * Comment Use Case Error Enums
 * Defines all error types for comment operations
 * Controllers map these to appropriate HTTP status codes
 */

/**
 * Comment error types for use case operations
 * Maps to HTTP status codes in API routes:
 * - 400: Validation errors (INVALID_*, MAX_*)
 * - 404: Not found errors (*_NOT_FOUND)
 * - 409: Conflict errors (ALREADY_*, CANNOT_*)
 * - 500: Internal server errors
 */
export enum CommentError {
  // Validation errors (400)
  INVALID_INPUT = "INVALID_INPUT",
  INVALID_CONTENT = "INVALID_CONTENT",
  CONTENT_TOO_SHORT = "CONTENT_TOO_SHORT",
  MAX_NESTING_DEPTH_EXCEEDED = "MAX_NESTING_DEPTH_EXCEEDED",

  // Not found errors (404)
  COMMENT_NOT_FOUND = "COMMENT_NOT_FOUND",
  POST_NOT_FOUND = "POST_NOT_FOUND",
  PARENT_COMMENT_NOT_FOUND = "PARENT_COMMENT_NOT_FOUND",
  AUTHOR_NOT_FOUND = "AUTHOR_NOT_FOUND",

  // Conflict errors (409)
  COMMENT_ALREADY_ARCHIVED = "COMMENT_ALREADY_ARCHIVED",
  COMMENT_NOT_ARCHIVED = "COMMENT_NOT_ARCHIVED",
  CANNOT_MODIFY_ARCHIVED_COMMENT = "CANNOT_MODIFY_ARCHIVED_COMMENT",
  CANNOT_COMMENT_ON_ARCHIVED_POST = "CANNOT_COMMENT_ON_ARCHIVED_POST",
  CANNOT_REPLY_TO_ARCHIVED_COMMENT = "CANNOT_REPLY_TO_ARCHIVED_COMMENT",

  // Server errors (500)
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
}
