/**
 * Get Leaderboard Use Case
 * Retrieves top N users by engagement points (post=5, comment=2, like=1)
 * Supports time period filtering: week, month, all-time
 */

import {
  ICommunityRepository,
  IUserRepository,
  IPostRepository,
  ICommentRepository,
  ILikeRepository,
} from "@/ports/repositories";
import {
  LeaderboardDto,
  LeaderboardEntryDto,
  GetLeaderboardDto,
} from "@/application/dtos/community-stats.dto";
import { CommunityError } from "@/application/errors/community.errors";

export class GetLeaderboardUseCase {
  constructor(
    private communityRepository: ICommunityRepository,
    private userRepository: IUserRepository,
    private postRepository: IPostRepository,
    private commentRepository: ICommentRepository,
    private likeRepository: ILikeRepository
  ) {}

  /**
   * Execute get leaderboard operation
   * Calculates user engagement points and returns top N users
   * @param query GetLeaderboardDto with communityId, limit, period
   * @returns LeaderboardDto with ranked entries
   * @throws Error with CommunityError enum values
   */
  async execute(query: GetLeaderboardDto): Promise<LeaderboardDto> {
    try {
      // Validate input
      if (!query.communityId || query.communityId.trim().length === 0) {
        throw new Error(CommunityError.INVALID_COMMUNITY_ID);
      }

      // Verify community exists
      const community = await this.communityRepository.findById(
        query.communityId
      );
      if (!community) {
        throw new Error(CommunityError.COMMUNITY_NOT_FOUND);
      }

      // Set defaults
      const limit = query.limit || 5;
      const period = query.period || "all-time";

      // Calculate date threshold based on period
      let dateThreshold: Date | null = null;
      const now = new Date();

      switch (period) {
        case "week":
          dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "all-time":
        default:
          dateThreshold = null; // No filtering
          break;
      }

      // Get all members
      const allMembers = await this.userRepository.findByCommunityId(
        query.communityId
      );

      // Calculate points for each user
      const userScores: Array<{
        userId: string;
        userName: string;
        userAvatar: string | null;
        points: number;
        postCount: number;
        commentCount: number;
        likeCount: number;
      }> = [];

      for (const user of allMembers.filter((u) => !u.isArchived())) {
        // Get user posts
        const userPosts = await this.postRepository.findByAuthorId(
          user.getId()
        );
        let postCount = userPosts.filter((p) => {
          if (!p.isPublished() || p.isArchived()) return false;
          if (!dateThreshold) return true;
          return p.getPublishedAt()! >= dateThreshold;
        }).length;

        // Get user comments
        const userComments = await this.commentRepository.findByAuthorId(
          user.getId()
        );
        let commentCount = userComments.filter((c) => {
          if (c.isArchived()) return false;
          if (!dateThreshold) return true;
          return c.getCreatedAt() >= dateThreshold;
        }).length;

        // Count user's likes given (simplified: count all likes from posts/comments by this user)
        // Note: This requires a more complex query in real implementation
        let likeCount = 0;
        // For now, we'll use a simplified approach - in production, add findByUserId to ILikeRepository
        // likeCount = await this.likeRepository.countByUser(user.getId(), dateThreshold);

        // Calculate points: post=5, comment=2, like=1
        const points = postCount * 5 + commentCount * 2 + likeCount * 1;

        userScores.push({
          userId: user.getId(),
          userName: user.getName(),
          userAvatar: user.getAvatarUrl(),
          points,
          postCount,
          commentCount,
          likeCount,
        });
      }

      // Sort by points descending
      userScores.sort((a, b) => b.points - a.points);

      // Take top N and assign ranks
      const topUsers = userScores.slice(0, limit);
      const entries: LeaderboardEntryDto[] = topUsers.map((user, index) => ({
        userId: user.userId,
        userName: user.userName,
        userAvatar: user.userAvatar,
        points: user.points,
        postCount: user.postCount,
        commentCount: user.commentCount,
        likeCount: user.likeCount,
        rank: index + 1,
      }));

      return {
        communityId: query.communityId,
        entries,
        period,
        generatedAt: new Date().toISOString(),
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
