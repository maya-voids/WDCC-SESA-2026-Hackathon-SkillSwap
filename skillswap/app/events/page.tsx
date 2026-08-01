import EventList from '../../components/EventList';

function EventPage() {
  return (
    <main style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Upcoming Events</h1>
      <EventList />
    </main>
  );
}

export default EventPage;