/**
 * Search Results Data Transfer Objects
 * Plain TypeScript interfaces for API communication
 * NO domain logic, NO Prisma types
 */

import { PostDto } from "./post.dto";
import { UserDto } from "./user.dto";

/**
 * Global Search Results DTO
 * Combined results from searching posts and members
 */
export interface SearchResultsDto {
  posts: PostDto[];
  members: UserDto[];
  totalResults: number;
  query: string;
}

/**
 * Search Query DTO for API requests
 * Full-text search parameters
 */
export interface SearchQueryDto {
  query: string;
  type: 'posts' | 'members' | 'all';
  communityId: string;
  limit?: number; // Default 20
  offset?: number; // Default 0
}
