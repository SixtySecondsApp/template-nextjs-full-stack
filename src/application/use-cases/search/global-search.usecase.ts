/**
 * Global Search Use Case
 * Searches posts and members with a single query
 * Orchestrates search adapter and maps results to DTOs
 */

import { ISearchAdapter } from "@/infrastructure/search/search.port";
import { SearchResultsDto } from "@/application/dtos/search-results.dto";
import { PostDtoMapper } from "@/application/mappers/post-dto.mapper";
import { UserDtoMapper } from "@/application/mappers/user-dto.mapper";
import { SearchError } from "@/application/errors/search.errors";

export class GlobalSearchUseCase {
  constructor(private searchAdapter: ISearchAdapter) {}

  /**
   * Execute global search operation
   * Searches both posts and members with a single query
   *
   * @param query Search query string (minimum 2 characters)
   * @param communityId Community ID to scope search
   * @param userId User ID making the search (for future personalisation)
   * @returns SearchResultsDto with posts, members, and total count
   * @throws Error with SearchError enum values
   */
  async execute(
    query: string,
    communityId: string,
    userId: string
  ): Promise<SearchResultsDto> {
    try {
      // Validate query
      if (!query || query.trim().length === 0) {
        throw new Error(SearchError.QUERY_TOO_SHORT);
      }

      if (query.trim().length < 2) {
        throw new Error(SearchError.QUERY_TOO_SHORT);
      }

      // Validate community ID
      if (!communityId || communityId.trim().length === 0) {
        throw new Error(SearchError.INVALID_COMMUNITY);
      }

      // Perform search via adapter
      const results = await this.searchAdapter.globalSearch(
        query.trim(),
        communityId
      );

      // Map domain entities to DTOs
      const posts = PostDtoMapper.toDtoArray(results.posts);
      const members = UserDtoMapper.toDtoArray(results.members);

      // Return results DTO
      return {
        posts,
        members,
        totalResults: results.totalResults,
        query: query.trim(),
      };
    } catch (error) {
      if (error instanceof Error) {
        // Re-throw known errors
        if (error.message === SearchError.QUERY_TOO_SHORT) {
          throw error;
        }
        if (error.message === SearchError.INVALID_COMMUNITY) {
          throw error;
        }
      }

      // Wrap unknown errors
      throw new Error(SearchError.SEARCH_FAILED);
    }
  }
}
