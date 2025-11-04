"use client";

import { useLeaderboard } from "@/hooks/useLeaderboard";

interface LeaderboardWidgetProps {
  communityId: string;
  limit?: number;
}

export function LeaderboardWidget({ communityId, limit = 5 }: LeaderboardWidgetProps) {
  const { data, isLoading, error } = useLeaderboard(communityId, limit);

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get gradient color for rank badge
  const getRankGradient = (rank: number) => {
    if (rank === 1) return "linear-gradient(135deg, #FFD700, #FFA500)"; // Gold
    if (rank === 2) return "linear-gradient(135deg, #C0C0C0, #808080)"; // Silver
    if (rank === 3) return "linear-gradient(135deg, #CD7F32, #8B4513)"; // Bronze
    return "transparent";
  };

  if (error) {
    return (
      <div className="widget">
        <h3 className="widget-title">🏆 Leaderboard (30-day)</h3>
        <p style={{ color: "var(--error)", fontSize: "14px", padding: "12px" }}>
          Failed to load leaderboard
        </p>
      </div>
    );
  }

  return (
    <div className="widget">
      <h3 className="widget-title">🏆 Leaderboard (30-day)</h3>
      <ul className="leaderboard-list">
        {isLoading ? (
          Array.from({ length: limit }).map((_, idx) => (
            <li key={idx} className="leaderboard-item">
              <div className="rank">{idx + 1}</div>
              <div className="leaderboard-avatar">...</div>
              <div className="leaderboard-info">
                <div className="leaderboard-name">Loading...</div>
                <div className="leaderboard-points">...</div>
              </div>
            </li>
          ))
        ) : (
          data?.data.map((leader) => (
            <li key={leader.userId} className="leaderboard-item">
              <div
                className={`rank ${leader.rank <= 3 ? "top" : ""}`}
                style={
                  leader.rank <= 3
                    ? { background: getRankGradient(leader.rank), color: "#fff" }
                    : {}
                }
              >
                {leader.rank}
              </div>
              <div className="leaderboard-avatar">
                {leader.avatarUrl ? (
                  <img src={leader.avatarUrl} alt={leader.name} />
                ) : (
                  getInitials(leader.name)
                )}
              </div>
              <div className="leaderboard-info">
                <div className="leaderboard-name">{leader.name}</div>
                <div className="leaderboard-points">
                  +{leader.points} pts
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
      <button
        className="btn btn-primary"
        style={{
          width: "100%",
          marginTop: "12px",
          background: "var(--surface)",
          color: "var(--text-primary)",
        }}
        onClick={() => console.log("[LeaderboardWidget] See all - not yet implemented")}
      >
        See all leaderboards
      </button>
    </div>
  );
}
