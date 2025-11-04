import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";

/**
 * Search Types
 */
export type SearchType = "posts" | "members" | "all";

/**
 * Search Result Types
 */
export interface PostSearchResult {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  communityId: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  highlight: {
    title?: string;
    content?: string;
  };
}

export interface MemberSearchResult {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  joinedAt: string;
  highlight: {
    name?: string;
    bio?: string;
  };
}

/**
 * Search Response
 */
interface SearchResponse {
  success: boolean;
  data: {
    posts: PostSearchResult[];
    members: MemberSearchResult[];
    totalResults: number;
  };
}

/**
 * Perform search query
 */
async function performSearch(
  query: string,
  type: SearchType
): Promise<SearchResponse> {
  const params = new URLSearchParams({
    q: query,
    type,
  });

  const response = await fetch(`/api/search?${params.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to perform search");
  }

  return response.json();
}

/**
 * Custom Hook: useSearch
 *
 * Full-text search with highlighting and type filtering
 * Minimum 2 characters required for search
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState("");
 * const { data, isLoading, error } = useSearch(searchTerm, "all");
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 *
 * return (
 *   <div>
 *     <h2>Posts ({data.data.posts.length})</h2>
 *     {data.data.posts.map((post) => (
 *       <div key={post.id}>
 *         <h3 dangerouslySetInnerHTML={{ __html: post.highlight.title || post.title }} />
 *         <p dangerouslySetInnerHTML={{ __html: post.highlight.content || post.content }} />
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useSearch(
  query: string | undefined,
  type: SearchType = "all"
) {
  return useQuery({
    queryKey: queryKeys.search.query(query || "", type),
    queryFn: () => performSearch(query!, type),
    enabled: !!query && query.length >= 2, // Minimum 2 characters
    staleTime: 30 * 1000, // 30 seconds - search results can be stale quickly
    gcTime: 2 * 60 * 1000, // 2 minutes - don't keep old searches long
  });
}
