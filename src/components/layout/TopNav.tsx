"use client";

import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { DarkModeToggle } from "@/components/theme/DarkModeToggle";

const tabs = [
  { id: "community", label: "Community" },
  { id: "chat", label: "Chat" },
  { id: "calendar", label: "Calendar" },
  { id: "leaderboard", label: "Leaderboard" },
];

export function TopNav() {
  const [activeTab, setActiveTab] = useState("community");
  const [searchQuery, setSearchQuery] = useState("");

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
        <div className="search-box">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search"
          />
        </div>

        <button className="icon-button" title="Notifications" aria-label="Notifications">
          <Bell size={20} />
        </button>

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
