import type { Service } from "../backend/DataUtils";
import EventCard from "./EventCard";

interface EventListProps {
  events: Service[];
}

export default function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="empty-state">
        <span>00</span>
        <h2>NO EVENTS FOUND</h2>
        <p>Try a different search term or browse every category.</p>
      </div>
    );
  }

  return (
    <div className="event-grid">
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))}
    </div>
  );
}
