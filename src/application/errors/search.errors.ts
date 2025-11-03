/**
 * Search Use Case Error Enums
 * Defines all error types for search operations
 * Controllers map these to appropriate HTTP status codes
 */

/**
 * Search error types for use case operations
 * Maps to HTTP status codes in API routes:
 * - 400: Validation errors (QUERY_TOO_SHORT, INVALID_*)
 * - 404: Not found errors (COMMUNITY_NOT_FOUND)
 * - 500: Internal server errors (SEARCH_FAILED)
 */
export enum SearchError {
  // Validation errors (400)
  QUERY_TOO_SHORT = "QUERY_TOO_SHORT",
  INVALID_COMMUNITY = "INVALID_COMMUNITY",

  // Server errors (500)
  SEARCH_FAILED = "SEARCH_FAILED",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}
