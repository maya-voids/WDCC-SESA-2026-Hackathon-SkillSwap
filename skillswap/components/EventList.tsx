import EventCard, { EventData } from './EventCard';

interface EventListProps {
  events: EventData[];
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
    <div className="event-grid" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '8px', 
            width: '100%'
          }}
    >
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))}
    </div>
  );
}