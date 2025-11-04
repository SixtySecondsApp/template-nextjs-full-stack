export function LeaderboardWidget() {
  const leaders = [
    { rank: 1, name: "Titus Blair", points: 3052, isTop: true },
    { rank: 2, name: "Muskan An. 🔥", points: 2538, isTop: true },
    { rank: 3, name: "Christian Ri...", points: 2088, isTop: true },
    { rank: 4, name: "Frank van B...", points: 1990, isTop: false },
    { rank: 5, name: "Kevin troy Lum...", points: 1393, isTop: false },
  ];

  return (
    <div className="widget">
      <h3 className="widget-title">🏆 Leaderboard (30-day)</h3>
      <ul className="leaderboard-list">
        {leaders.map((leader) => (
          <li key={leader.rank} className="leaderboard-item">
            <div className={`rank ${leader.isTop ? "top" : ""}`}>{leader.rank}</div>
            <div className="leaderboard-avatar"></div>
            <div className="leaderboard-info">
              <div className="leaderboard-name">{leader.name}</div>
              <div className="leaderboard-points">+{leader.points} pts</div>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="btn btn-primary"
        style={{
          width: "100%",
          marginTop: "12px",
          background: "var(--surface)",
          color: "var(--text-primary)",
        }}
      >
        See all leaderboards
      </button>
    </div>
  );
}
