/**
 * Search Use Case
 * Full-text search across posts and members within a community
 * Supports filtering by type: posts, members, or all
 */

import { ICommunityRepository, ISearchAdapter } from "@/ports/repositories";
import {
  SearchResultsDto,
  SearchQueryDto,
} from "@/application/dtos/search-results.dto";
import { PostDtoMapper } from "@/application/mappers/post-dto.mapper";
import { UserDtoMapper } from "@/application/mappers/user-dto.mapper";
import { SearchError } from "@/application/errors/community.errors";

export class SearchUseCase {
  constructor(
    private searchAdapter: ISearchAdapter,
    private communityRepository: ICommunityRepository
  ) {}

  /**
   * Execute search operation
   * Searches posts (title, body) and members (name, bio)
   * @param query SearchQueryDto with query string, type, and communityId
   * @returns SearchResultsDto with posts and members
   * @throws Error with SearchError enum values
   */
  async execute(query: SearchQueryDto): Promise<SearchResultsDto> {
    try {
      // Validate input
      if (!query.query || query.query.trim().length === 0) {
        throw new Error(SearchError.INVALID_QUERY);
      }

      if (query.query.trim().length < 2) {
        throw new Error(SearchError.QUERY_TOO_SHORT);
      }

      if (!query.communityId || query.communityId.trim().length === 0) {
        throw new Error(SearchError.INVALID_COMMUNITY_ID);
      }

      const validTypes = ["posts", "members", "all"];
      if (!validTypes.includes(query.type)) {
        throw new Error(SearchError.INVALID_TYPE);
      }

      // Verify community exists
      const community = await this.communityRepository.findById(
        query.communityId
      );
      if (!community) {
        throw new Error(SearchError.COMMUNITY_NOT_FOUND);
      }

      const searchQuery = query.query.trim();

      // Perform search based on type
      let posts: any[] = [];
      let members: any[] = [];

      switch (query.type) {
        case "posts":
          posts = await this.searchAdapter.searchPosts(
            searchQuery,
            query.communityId
          );
          break;

        case "members":
          members = await this.searchAdapter.searchMembers(
            searchQuery,
            query.communityId
          );
          break;

        case "all":
        default:
          // Global search across posts and members
          const results = await this.searchAdapter.globalSearch(
            searchQuery,
            query.communityId
          );
          posts = results.posts;
          members = results.members;
          break;
      }

      // Apply limit if specified
      const limit = query.limit || 20;
      const offset = query.offset || 0;

      posts = posts.slice(offset, offset + limit);
      members = members.slice(offset, offset + limit);

      // Convert to DTOs
      const postDtos = PostDtoMapper.toDtoArray(posts);
      const memberDtos = UserDtoMapper.toDtoArray(members);

      return {
        posts: postDtos,
        members: memberDtos,
        totalResults: postDtos.length + memberDtos.length,
        query: searchQuery,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === SearchError.INVALID_QUERY ||
          error.message === SearchError.QUERY_TOO_SHORT ||
          error.message === SearchError.INVALID_TYPE ||
          error.message === SearchError.INVALID_COMMUNITY_ID ||
          error.message === SearchError.COMMUNITY_NOT_FOUND
        ) {
          throw error;
        }
      }
      throw new Error(SearchError.INTERNAL_SERVER_ERROR);
    }
  }
}
