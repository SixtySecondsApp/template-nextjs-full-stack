export function EventsWidget() {
  const events = [
    { date: "Tomorrow at 3:00 PM", title: "Q&A with Nate - AI Automation", attendees: 142 },
    { date: "Nov 5 at 2:00 PM", title: "Weekly Wins Showcase", attendees: 89 },
    { date: "Nov 8 at 10:00 AM", title: "Community Office Hours", attendees: 56 },
  ];

  return (
    <div className="widget">
      <h3 className="widget-title">📅 Upcoming Events</h3>
      {events.map((event, idx) => (
        <div key={idx} className="event-card">
          <div className="event-date">{event.date}</div>
          <div className="event-title">{event.title}</div>
          <div className="event-attendees">{event.attendees} attending</div>
        </div>
      ))}
    </div>
  );
}
