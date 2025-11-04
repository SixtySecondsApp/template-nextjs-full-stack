/**
 * Get Community Stats Use Case
 * Retrieves real-time community statistics for widgets
 * Calculates total members, online members (active in last 15 mins), admins, posts, and comments
 */

import {
  ICommunityRepository,
  IUserRepository,
  IPostRepository,
  ICommentRepository,
} from "@/ports/repositories";
import { CommunityStatsDto } from "@/application/dtos/community-stats.dto";
import { CommunityError } from "@/application/errors/community.errors";

export class GetCommunityStatsUseCase {
  constructor(
    private communityRepository: ICommunityRepository,
    private userRepository: IUserRepository,
    private postRepository: IPostRepository,
    private commentRepository: ICommentRepository
  ) {}

  /**
   * Execute get community stats operation
   * Returns real-time community metrics
   * @param communityId Community ID
   * @returns CommunityStatsDto
   * @throws Error with CommunityError enum values
   */
  async execute(communityId: string): Promise<CommunityStatsDto> {
    try {
      // Validate input
      if (!communityId || communityId.trim().length === 0) {
        throw new Error(CommunityError.INVALID_COMMUNITY_ID);
      }

      // Verify community exists
      const community = await this.communityRepository.findById(communityId);
      if (!community) {
        throw new Error(CommunityError.COMMUNITY_NOT_FOUND);
      }

      // Get all members
      const allMembers = await this.userRepository.findByCommunityId(
        communityId
      );

      // Count total members (non-archived)
      const totalMembers = allMembers.filter((u) => !u.isArchived()).length;

      // Count online members (active in last 15 mins)
      // Note: This requires lastSeenAt tracking in User entity
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      const onlineMembers = allMembers.filter((u) => {
        const lastSeen = u.getLastSeenAt();
        return lastSeen && lastSeen >= fifteenMinutesAgo && !u.isArchived();
      }).length;

      // Count admins (role = ADMIN)
      const totalAdmins = allMembers.filter(
        (u) => u.getRole() === "ADMIN" && !u.isArchived()
      ).length;

      // Get all posts and comments
      const allPosts = await this.postRepository.findByCommunityId(communityId);
      const totalPosts = allPosts.filter(
        (p) => p.isPublished() && !p.isArchived()
      ).length;

      // Count total comments across all posts
      let totalComments = 0;
      for (const post of allPosts) {
        const comments = await this.commentRepository.findByPostId(
          post.getId()
        );
        totalComments += comments.filter((c) => !c.isArchived()).length;
      }

      return {
        communityId,
        totalMembers,
        onlineMembers,
        totalAdmins,
        totalPosts,
        totalComments,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === CommunityError.INVALID_COMMUNITY_ID ||
          error.message === CommunityError.COMMUNITY_NOT_FOUND
        ) {
          throw error;
        }
      }
      throw new Error(CommunityError.INTERNAL_SERVER_ERROR);
    }
  }
}
