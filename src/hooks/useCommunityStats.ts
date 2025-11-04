import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";

/**
 * Community Stats DTO
 */
export interface CommunityStatsDTO {
  memberCount: number;
  onlineCount: number;
  adminCount: number;
}

/**
 * Community Stats Response
 */
interface CommunityStatsResponse {
  success: boolean;
  data: CommunityStatsDTO;
}

/**
 * Fetch community statistics
 */
async function fetchCommunityStats(communityId: string): Promise<CommunityStatsResponse> {
  const response = await fetch(`/api/community/${communityId}/stats`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch community stats");
  }

  return response.json();
}

/**
 * Custom Hook: useCommunityStats
 *
 * Fetches real-time community statistics with automatic refetching
 * Refetches every 60 seconds for near real-time updates
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useCommunityStats("community-123");
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 *
 * return (
 *   <div>
 *     <p>Members: {data.data.memberCount}</p>
 *     <p>Online: {data.data.onlineCount}</p>
 *     <p>Admins: {data.data.adminCount}</p>
 *   </div>
 * );
 * ```
 */
export function useCommunityStats(communityId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.community.stats(communityId || ""),
    queryFn: () => fetchCommunityStats(communityId!),
    enabled: !!communityId,
    staleTime: 30 * 1000, // 30 seconds - consider data stale after this
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache for this long
    refetchInterval: 60 * 1000, // Refetch every 60 seconds for real-time updates
    refetchIntervalInBackground: false, // Don't refetch when tab is not visible
  });
}
