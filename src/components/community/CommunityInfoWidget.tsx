"use client";

import { useCommunityStats } from "@/hooks/useCommunityStats";

interface CommunityInfoWidgetProps {
  communityId: string;
}

export function CommunityInfoWidget({ communityId }: CommunityInfoWidgetProps) {
  const { data, isLoading, error } = useCommunityStats(communityId);

  // Format number for display (e.g., 1234 -> 1.2k)
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (error) {
    return (
      <div className="widget community-info">
        <p style={{ color: "var(--error)", fontSize: "14px" }}>
          Failed to load community stats
        </p>
      </div>
    );
  }

  return (
    <div className="widget community-info">
      <div className="community-logo">CO</div>
      <h3 className="community-name">Community OS</h3>
      <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "8px" }}>
        The AI-first community platform
      </p>

      <div className="community-stats">
        {isLoading ? (
          <>
            <div className="stat">
              <span className="stat-value">...</span>
              <span className="stat-label">Members</span>
            </div>
            <div className="stat">
              <span className="stat-value">...</span>
              <span className="stat-label">Online</span>
            </div>
            <div className="stat">
              <span className="stat-value">...</span>
              <span className="stat-label">Admins</span>
            </div>
          </>
        ) : (
          <>
            <div className="stat">
              <span className="stat-value">
                {formatNumber(data?.data.memberCount || 0)}
              </span>
              <span className="stat-label">Members</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {formatNumber(data?.data.onlineCount || 0)}
              </span>
              <span className="stat-label">Online</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {formatNumber(data?.data.adminCount || 0)}
              </span>
              <span className="stat-label">Admins</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
