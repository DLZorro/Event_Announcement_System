import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createEvent, getEvents } from './api/events';
import './App.css';

// Define the event type for the form
interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
}

function App() {
  const queryClient = useQueryClient();
  const [newEvent, setNewEvent] = useState<EventFormData>({ 
    title: '', 
    description: '', 
    date: '', 
    location: '' 
  });

  // Fetch events with proper typing
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents
  });

  // Create event mutation
  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setNewEvent({ title: '', description: '', date: '', location: '' });
      alert('Event created successfully!');
    },
    onError: (error: Error) => {
      alert(`Error creating event: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newEvent);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Event Announcement System</h1>

        {/* Create Event Form */}
        <form onSubmit={handleSubmit} className="form">
          <h2>Create New Event</h2>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              required
            />
            <input
              type="datetime-local"
              value={newEvent.date}
              onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
            />
            <textarea
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              rows={3}
            />
          </div>
          <button 
            type="submit" 
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Event'}
          </button>
        </form>

        {/* Events List */}
        <div className="events-section">
          <h2>Upcoming Events</h2>
          
          {isLoading && <p>Loading events...</p>}
          
          {error && <p className="error">Error loading events: {(error as Error).message}</p>}
          
          {!isLoading && !error && events.length === 0 && (
            <p>No events yet. Create one!</p>
          )}
          
          {!isLoading && !error && events.length > 0 && (
            <div className="events-grid">
              {events.map((event) => (
                <div key={event.eventId} className="event-card">
                  <h3>{event.title}</h3>
                  <p className="event-date">
                    {formatDate(event.date)}
                  </p>
                  {event.location && <p className="event-location">📍 {event.location}</p>}
                  {event.description && <p className="event-description">{event.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;