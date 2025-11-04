"use client";

import { useState } from "react";
import { Settings, LogOut, User, ChevronUp } from "lucide-react";
import Link from "next/link";

interface SidebarFooterProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

export function SidebarFooter({
  userName = "User",
  userEmail,
  userAvatar,
  onSettingsClick,
  onLogoutClick,
}: SidebarFooterProps) {
  const [showMenu, setShowMenu] = useState(false);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative border-t border-border p-4">
      {/* User profile button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
        aria-expanded={showMenu}
        aria-haspopup="menu"
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        {/* User info */}
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{userName}</p>
          {userEmail && (
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          )}
        </div>

        {/* Expand icon */}
        <ChevronUp
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            showMenu ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {showMenu && (
        <div className="absolute bottom-full left-4 right-4 mb-2 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
          <div className="py-1">
            {/* Profile link */}
            <Link
              href="/settings/profile"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
              onClick={() => setShowMenu(false)}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>

            {/* Settings link */}
            <button
              onClick={() => {
                setShowMenu(false);
                onSettingsClick?.();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            {/* Divider */}
            <div className="my-1 h-px bg-border" />

            {/* Logout */}
            <button
              onClick={() => {
                setShowMenu(false);
                onLogoutClick?.();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-accent transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
