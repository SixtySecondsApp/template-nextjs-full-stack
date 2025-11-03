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
