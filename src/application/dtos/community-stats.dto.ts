/**
 * Community Statistics Data Transfer Objects
 * Plain TypeScript interfaces for community metrics and leaderboards
 * NO domain logic, NO Prisma types
 */

/**
 * Community Stats DTO for API responses
 * Real-time community statistics for widgets
 */
export interface CommunityStatsDto {
  communityId: string;
  totalMembers: number;
  onlineMembers: number; // Members active in last 15 mins
  totalAdmins: number;
  totalPosts: number;
  totalComments: number;
}

/**
 * Leaderboard Entry DTO
 * Individual user ranking with points
 */
export interface LeaderboardEntryDto {
  userId: string;
  userName: string;
  userAvatar: string | null;
  points: number; // Calculated: post=5, comment=2, like=1
  postCount: number;
  commentCount: number;
  likeCount: number;
  rank: number;
}

/**
 * Leaderboard DTO for API responses
 * Top N users by engagement points
 */
export interface LeaderboardDto {
  communityId: string;
  entries: LeaderboardEntryDto[];
  period: 'week' | 'month' | 'all-time'; // Time period filter
  generatedAt: string; // ISO 8601 string
}

/**
 * Get Leaderboard DTO for API requests
 * Query parameters for leaderboard
 */
export interface GetLeaderboardDto {
  communityId: string;
  limit?: number; // Default 5
  period?: 'week' | 'month' | 'all-time'; // Default 'all-time'
}
