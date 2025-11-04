"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface SidebarHeaderProps {
  communityName?: string;
  communityInitials?: string;
  showSwitcher?: boolean;
  onSwitcherClick?: () => void;
}

export function SidebarHeader({
  communityName = "Community OS",
  communityInitials = "CO",
  showSwitcher = false,
  onSwitcherClick,
}: SidebarHeaderProps) {
  return (
    <div className="px-5 py-4 border-b border-border">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Logo with gradient */}
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {communityInitials}
          </div>
          {/* Community name */}
          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {communityName}
          </span>
        </Link>

        {/* Community switcher */}
        {showSwitcher && (
          <button
            onClick={onSwitcherClick}
            className="p-1.5 rounded-md hover:bg-accent transition-colors"
            aria-label="Switch community"
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}
