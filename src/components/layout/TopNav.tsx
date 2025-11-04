"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { DarkModeToggle } from "@/components/theme/DarkModeToggle";
import { SearchBar } from "@/components/search";
import { NotificationBell } from "@/components/notifications";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

const tabs = [
  { id: "community", label: "Community" },
  { id: "chat", label: "Chat" },
  { id: "calendar", label: "Calendar" },
  { id: "leaderboard", label: "Leaderboard" },
];

export function TopNav() {
  const [activeTab, setActiveTab] = useState("community");
  const { user } = useUser();

  // Mock role check - In production, this would check user roles from database
  const isAdmin = user?.publicMetadata?.role === 'admin' || user?.publicMetadata?.role === 'owner';

  return (
    <header className="top-nav">
      {/* Admin Dashboard Link */}
      {isAdmin && (
        <Link
          href="/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            marginRight: '16px',
            background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s',
            boxShadow: 'var(--shadow-sm)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </Link>
      )}

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
