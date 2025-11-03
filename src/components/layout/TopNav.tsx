"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { DarkModeToggle } from "@/components/theme/DarkModeToggle";
import { SearchBar } from "@/components/search";
import { NotificationBell } from "@/components/notifications";

const tabs = [
  { id: "community", label: "Community" },
  { id: "chat", label: "Chat" },
  { id: "calendar", label: "Calendar" },
  { id: "leaderboard", label: "Leaderboard" },
];

export function TopNav() {
  const [activeTab, setActiveTab] = useState("community");
  const { user } = useUser();

  return (
    <header className="top-nav">
      <div className="nav-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="top-nav-actions">
        {/* Desktop: Inline search bar */}
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <SearchBar placeholder="Search posts and members..." />
        </div>

        {/* Mobile: Search icon that opens modal - TODO: implement modal */}
        <div className="md:hidden">
          {/* Placeholder for mobile search modal trigger */}
        </div>

        {/* Notification Bell */}
        {user && <NotificationBell userId={user.id} />}

        <DarkModeToggle />

        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-9 h-9",
            },
          }}
        />
      </div>
    </header>
  );
}
