/**
 * List Posts Use Case
 * Retrieves posts for a community with filtering and pagination
 * Supports filters: all, new, active, top
 */

import { ICommunityRepository, IPostRepository } from "@/ports/repositories";
import { ListPostsDto, ListPostsQueryDto } from "@/application/dtos/post.dto";
import { PostDtoMapper } from "@/application/mappers/post-dto.mapper";
import { PostError } from "@/application/errors/post.errors";

export class ListPostsUseCase {
  constructor(
    private postRepository: IPostRepository,
    private communityRepository: ICommunityRepository
  ) {}

  /**
   * Execute list posts operation
   * Retrieves published posts with filter and pagination
   * @param query ListPostsQueryDto with communityId, filter, page, limit
   * @returns ListPostsDto with paginated posts
   * @throws Error with PostError enum values
   */
  async execute(query: ListPostsQueryDto): Promise<ListPostsDto> {
    try {
      // Validate input
      if (!query.communityId || query.communityId.trim().length === 0) {
        throw new Error(PostError.INVALID_INPUT);
      }

      // Verify community exists
      const community = await this.communityRepository.findById(
        query.communityId
      );
      if (!community) {
        throw new Error(PostError.COMMUNITY_NOT_FOUND);
      }

      // Set defaults
      const page = query.page || 1;
      const limit = query.limit || 20;
      const filter = query.filter || "all";

      // Find all posts for community
      const allPosts = await this.postRepository.findByCommunityId(
        query.communityId
      );

      // Filter published posts only
      const publishedPosts = allPosts.filter((p) => p.isPublished());

      // Apply filter
      let filteredPosts = publishedPosts;

      switch (filter) {
        case "new":
          // Newest first (by publishedAt)
          filteredPosts = publishedPosts.sort(
            (a, b) =>
              b.getPublishedAt()!.getTime() - a.getPublishedAt()!.getTime()
          );
          break;

        case "active":
          // Most comments/recent activity (by updatedAt)
          filteredPosts = publishedPosts.sort(
            (a, b) => b.getUpdatedAt().getTime() - a.getUpdatedAt().getTime()
          );
          break;

        case "top":
          // Most likes/engagement
          filteredPosts = publishedPosts.sort(
            (a, b) => b.getLikeCount() - a.getLikeCount()
          );
          break;

        case "all":
        default:
          // Pinned first, then newest
          filteredPosts = publishedPosts.sort((a, b) => {
            if (a.getIsPinned() && !b.getIsPinned()) return -1;
            if (!a.getIsPinned() && b.getIsPinned()) return 1;
            return (
              b.getPublishedAt()!.getTime() - a.getPublishedAt()!.getTime()
            );
          });
          break;
      }

      // Apply pagination
      const total = filteredPosts.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
      const hasMore = endIndex < total;

      return {
        posts: PostDtoMapper.toDtoArray(paginatedPosts),
        total,
        page,
        limit,
        hasMore,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === PostError.INVALID_INPUT ||
          error.message === PostError.COMMUNITY_NOT_FOUND
        ) {
          throw error;
        }
      }
      throw new Error(PostError.INTERNAL_SERVER_ERROR);
    }
  }
}
