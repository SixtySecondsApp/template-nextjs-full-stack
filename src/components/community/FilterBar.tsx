"use client";

import { useState } from "react";

export function FilterBar() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All" },
    { id: "new", label: "New" },
    { id: "active", label: "Active" },
    { id: "top", label: "Top" },
    { id: "solved", label: "Solved" },
    { id: "trending", label: "🔥 Trending" },
  ];

  return (
    <div className="filter-bar">
      {filters.map((filter) => (
        <div
          key={filter.id}
          className={`filter-chip ${activeFilter === filter.id ? "active" : ""}`}
          onClick={() => setActiveFilter(filter.id)}
        >
          {filter.label}
        </div>
      ))}
    </div>
  );
}
