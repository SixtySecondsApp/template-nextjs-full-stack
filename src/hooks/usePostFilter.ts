import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Post Filter Types
 */
export type PostFilter = "all" | "new" | "active" | "top";

/**
 * Custom Hook: usePostFilter
 *
 * Manages post filter state with URL params and localStorage sync
 * Syncs filter state between URL query params and localStorage
 *
 * @example
 * ```tsx
 * const { filter, setFilter } = usePostFilter("all");
 *
 * <button onClick={() => setFilter("new")}>
 *   Show New Posts
 * </button>
 * ```
 */
export function usePostFilter(defaultFilter: PostFilter = "all") {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current filter from URL or localStorage or default
  const getCurrentFilter = (): PostFilter => {
    // 1. Check URL params first
    const urlFilter = searchParams.get("filter") as PostFilter | null;
    if (urlFilter && ["all", "new", "active", "top"].includes(urlFilter)) {
      return urlFilter;
    }

    // 2. Check localStorage second
    if (typeof window !== "undefined") {
      const storedFilter = localStorage.getItem("post-filter") as PostFilter | null;
      if (storedFilter && ["all", "new", "active", "top"].includes(storedFilter)) {
        return storedFilter;
      }
    }

    // 3. Use default
    return defaultFilter;
  };

  const filter = getCurrentFilter();

  // Set filter and sync to URL + localStorage
  const setFilter = (newFilter: PostFilter) => {
    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("post-filter", newFilter);
    }

    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", newFilter);

    // Navigate with new params
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Sync URL on mount if not present
  useEffect(() => {
    const urlFilter = searchParams.get("filter");
    if (!urlFilter && filter !== defaultFilter) {
      // If no URL filter but we have a stored filter, update URL
      const params = new URLSearchParams(searchParams.toString());
      params.set("filter", filter);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, []);

  return {
    filter,
    setFilter,
  };
}
