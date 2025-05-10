import React, { useState, useContext } from 'react';
import './Events.css';
import { AuthContext } from './AuthContext';

const eventsData = [
  { title: 'Networking Event', location: 'New York, NY', date: '2025-03-15', time: '6:00 PM', description: 'Join us for a networking event to connect with professionals in your field.' },
  { title: 'Workshop: Building Your Brand', location: 'San Francisco, CA', date: '2025-04-10', time: '10:00 AM', description: 'Learn how to build and promote your personal brand.' },
  { title: 'Webinar: Future of AI', location: 'Online', date: '2025-05-05', time: '2:00 PM', description: 'Explore the future of AI and its impact on various industries.' },
  { title: 'Tech Conference 2025', location: 'Los Angeles, CA', date: '2025-06-20', time: '9:00 AM', description: 'A conference to discuss the latest trends in technology.' },
  { title: 'Startup Pitch Night', location: 'Boston, MA', date: '2025-07-15', time: '5:00 PM', description: 'Pitch your startup idea to a panel of investors.' }
];

const Events = () => {
  const { user } = useContext(AuthContext);
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // New state for event creation form and events list
  const [showCreateEventForm, setShowCreateEventForm] = useState(false);
  const [events, setEvents] = useState(eventsData);
  const [newEvent, setNewEvent] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
    description: "",
    createdBy: user ? user.username : "Anonymous"
  });

  const handleLocationChange = (e) => setSelectedLocation(e.target.value);
  const handleDateRangeChange = (e) => setSelectedDateRange(e.target.value);

  const filterByDateRange = (eventDate) => {
    const currentDate = new Date();
    const eventDateObj = new Date(eventDate);
    switch (selectedDateRange) {
      case 'Next 7 Days':
        const next7Days = new Date(); next7Days.setDate(currentDate.getDate() + 7);
        return eventDateObj >= currentDate && eventDateObj <= next7Days;
      case 'Next 30 Days':
        const next30Days = new Date(); next30Days.setDate(currentDate.getDate() + 30);
        return eventDateObj >= currentDate && eventDateObj <= next30Days;
      case 'Next 90 Days':
        const next90Days = new Date(); next90Days.setDate(currentDate.getDate() + 90);
        return eventDateObj >= currentDate && eventDateObj <= next90Days;
      default:
        return true;
    }
  };

  const filteredEvents = events.filter(evt => {
    const matchesLocation = selectedLocation === 'All' || evt.location === selectedLocation;
    const matchesDate = selectedDateRange === 'All' || filterByDateRange(evt.date);
    return matchesLocation && matchesDate;
  });

  const handleBookClick = (evt) => {
    setSelectedEvent(evt);
    setBookingConfirmed(false);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleConfirmBooking = () => {
    setBookingConfirmed(true);
  };

  // New event creation handlers
  const toggleCreateEventForm = () => {
    if (!showCreateEventForm) {
      setNewEvent({
        title: "",
        location: "",
        date: "",
        time: "",
        description: "",
        createdBy: user ? user.username : "Anonymous"
      });
    }
    setShowCreateEventForm(!showCreateEventForm);
  };

  const handleNewEventChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    setEvents([newEvent, ...events]);
    setShowCreateEventForm(false);
  };

  return (
    <div className="events-page">
      <h1>Upcoming Events</h1>
      <div className="filter">
        <label htmlFor="location">Filter by location:</label>
        <select id="location" value={selectedLocation} onChange={handleLocationChange}>
          <option value="All">All</option>
          <option value="New York, NY">New York, NY</option>
          <option value="San Francisco, CA">San Francisco, CA</option>
          <option value="Online">Online</option>
          <option value="Los Angeles, CA">Los Angeles, CA</option>
          <option value="Boston, MA">Boston, MA</option>
        </select>
        <label htmlFor="dateRange">Filter by date:</label>
        <select id="dateRange" value={selectedDateRange} onChange={handleDateRangeChange}>
          <option value="All">All</option>
          <option value="Next 7 Days">Next 7 Days</option>
          <option value="Next 30 Days">Next 30 Days</option>
          <option value="Next 90 Days">Next 90 Days</option>
        </select>
      </div>
      <button className="create-event-button" onClick={toggleCreateEventForm}>
        {showCreateEventForm ? "Cancel" : "Create Event"}
      </button>
      {showCreateEventForm && (
        <form className="create-event-form" onSubmit={handleCreateEvent}>
          <input type="text" name="title" placeholder="Event Title" value={newEvent.title} onChange={handleNewEventChange} required />
          <input type="text" name="location" placeholder="Location" value={newEvent.location} onChange={handleNewEventChange} required />
          <input type="date" name="date" value={newEvent.date} onChange={handleNewEventChange} required />
          <input type="time" name="time" value={newEvent.time} onChange={handleNewEventChange} required />
          <textarea name="description" placeholder="Description" value={newEvent.description} onChange={handleNewEventChange} required />
          <button type="submit">Submit Event</button>
        </form>
      )}
      <div className="events-list">
        {filteredEvents.map((evt, idx) => (
          <div key={idx} className="event-card">
            <h2>{evt.title}</h2>
            <p><strong>Location:</strong> {evt.location}</p>
            <p><strong>Date:</strong> {new Date(evt.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {evt.time}</p>
            <p>{evt.description}</p>
            {evt.createdBy && <p><strong>Created by:</strong> {evt.createdBy}</p>}
            <button className="event-button" onClick={() => handleBookClick(evt)}>Book</button>
          </div>
        ))}
      </div>
      {selectedEvent && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>{selectedEvent.title}</h2>
            <p><strong>Location:</strong> {selectedEvent.location}</p>
            <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {selectedEvent.time}</p>
            <p>{selectedEvent.description}</p>
            {selectedEvent.createdBy && <p><strong>Created by:</strong> {selectedEvent.createdBy}</p>}
            <div className="modal-button-container">
              <button className="modal-button" onClick={handleConfirmBooking}>Book</button>
            </div>
            {bookingConfirmed && <p className="confirmation-message">Booking Confirmed!</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;