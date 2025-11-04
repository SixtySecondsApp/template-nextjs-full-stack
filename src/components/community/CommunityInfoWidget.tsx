export function CommunityInfoWidget() {
  const stats = [
    { value: "1.2k", label: "Members" },
    { value: "420", label: "Online" },
    { value: "15", label: "Admins" },
  ];

  return (
    <div className="widget community-info">
      <div className="community-logo">CO</div>
      <h3 className="community-name">Community OS</h3>
      <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "8px" }}>
        The AI-first community platform
      </p>

      <div className="community-stats">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
