import EventCard, { EventData } from './EventCard';

export default function EventList() {
  const events: EventData[] = [
    { id: 1, title: 'Meet&Greet', location: 'Auckland CBD', type: 'workshop' },
    { id: 2, title: 'WDCCxSESA', location: 'GridAKL', type: 'hackathon' },
    { id: 3, title: 'HTML&CSS', location: 'Grey Lynn', type: 'workshop' },
  ];

  return (
    <div>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}