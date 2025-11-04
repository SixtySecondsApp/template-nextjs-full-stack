import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";

/**
 * Leaderboard Entry DTO
 */
export interface LeaderboardEntryDTO {
  rank: number;
  userId: string;
  name: string;
  avatarUrl: string | null;
  points: number;
  breakdown: {
    postPoints: number;
    commentPoints: number;
    likePoints: number;
  };
}

/**
 * Leaderboard Response
 */
interface LeaderboardResponse {
  success: boolean;
  data: LeaderboardEntryDTO[];
}

/**
 * Fetch leaderboard data
 */
async function fetchLeaderboard(
  communityId: string,
  limit: number
): Promise<LeaderboardResponse> {
  const response = await fetch(
    `/api/community/${communityId}/leaderboard?limit=${limit}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch leaderboard");
  }

  return response.json();
}

/**
 * Custom Hook: useLeaderboard
 *
 * Fetches top contributors by points with breakdown
 * Points calculation: post=5, comment=2, like=1
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useLeaderboard("community-123", 5);
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 *
 * return (
 *   <div>
 *     {data.data.map((entry) => (
 *       <div key={entry.userId}>
 *         <span>#{entry.rank} {entry.name}</span>
 *         <span>{entry.points} points</span>
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useLeaderboard(
  communityId: string | undefined,
  limit: number = 5
) {
  return useQuery({
    queryKey: queryKeys.community.leaderboard(communityId || "", limit),
    queryFn: () => fetchLeaderboard(communityId!, limit),
    enabled: !!communityId,
    staleTime: 5 * 60 * 1000, // 5 minutes - leaderboard doesn't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache
  });
}
