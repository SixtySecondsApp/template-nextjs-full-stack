import { CommunityInfoWidget } from "./CommunityInfoWidget";
import { LeaderboardWidget } from "./LeaderboardWidget";
import { EventsWidget } from "./EventsWidget";

export function RightSidebar() {
  return (
    <aside className="sidebar-right">
      <CommunityInfoWidget />
      <LeaderboardWidget />
      <EventsWidget />
    </aside>
  );
}
