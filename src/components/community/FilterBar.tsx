"use client";

import { usePostFilter, type PostFilter } from "@/hooks/usePostFilter";

interface FilterBarProps {
  onFilterChange?: (filter: PostFilter) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const { filter: activeFilter, setFilter } = usePostFilter("all");

  const filters = [
    { id: "all" as PostFilter, label: "All" },
    { id: "new" as PostFilter, label: "New" },
    { id: "active" as PostFilter, label: "Active" },
    { id: "top" as PostFilter, label: "Top" },
  ];

  const handleFilterClick = (filterId: PostFilter) => {
    setFilter(filterId);
    onFilterChange?.(filterId);

    // Smooth scroll to top when filter changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="filter-bar">
      {filters.map((filter) => (
        <div
          key={filter.id}
          className={`filter-chip ${activeFilter === filter.id ? "active" : ""}`}
          onClick={() => handleFilterClick(filter.id)}
        >
          {filter.label}
        </div>
      ))}
    </div>
  );
}
