/**
 * Search Data Transfer Objects
 * Plain TypeScript interfaces for API communication
 * NO domain logic, NO Prisma types
 */

/**
 * Search result types
 */
export type SearchResultType = 'post' | 'user';

/**
 * Search Result DTO for API responses
 * Represents a single search result item
 */
export interface SearchResultDto {
  id: string;
  type: SearchResultType;
  title: string;
  snippet: string;
  url: string;
  relevanceScore?: number;
}

/**
 * Search Query DTO for API requests
 * Performs search across posts and users
 */
export interface SearchQueryDto {
  query: string;
  communityId?: string;
  type?: SearchResultType;
  limit?: number;
}

/**
 * Search Response DTO for API responses
 * Returns paginated search results
 */
export interface SearchResponseDto {
  results: SearchResultDto[];
  totalCount: number;
  query: string;
}
