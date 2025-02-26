import React, { useState } from 'react';
import './Events.css';

const eventsData = [
  {
    title: 'Networking Event',
    location: 'New York, NY',
    date: '2025-03-15',
    time: '6:00 PM',
    description: 'Join us for a networking event to connect with professionals in your field.'
  },
  {
    title: 'Workshop: Building Your Brand',
    location: 'San Francisco, CA',
    date: '2025-04-10',
    time: '10:00 AM',
    description: 'Learn how to build and promote your personal brand.'
  },
  {
    title: 'Webinar: Future of AI',
    location: 'Online',
    date: '2025-05-05',
    time: '2:00 PM',
    description: 'Explore the future of AI and its impact on various industries.'
  },
  {
    title: 'Tech Conference 2025',
    location: 'Los Angeles, CA',
    date: '2025-06-20',
    time: '9:00 AM',
    description: 'A conference to discuss the latest trends in technology.'
  },
  {
    title: 'Startup Pitch Night',
    location: 'Boston, MA',
    date: '2025-07-15',
    time: '5:00 PM',
    description: 'Pitch your startup idea to a panel of investors.'
  }
];

const Events = () => {
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleDateRangeChange = (event) => {
    setSelectedDateRange(event.target.value);
  };

  const filterByDateRange = (eventDate) => {
    const currentDate = new Date();
    const eventDateObj = new Date(eventDate);

    switch (selectedDateRange) {
      case 'Next 7 Days':
        const next7Days = new Date();
        next7Days.setDate(currentDate.getDate() + 7);
        return eventDateObj >= currentDate && eventDateObj <= next7Days;
      case 'Next 30 Days':
        const next30Days = new Date();
        next30Days.setDate(currentDate.getDate() + 30);
        return eventDateObj >= currentDate && eventDateObj <= next30Days;
      case 'Next 90 Days':
        const next90Days = new Date();
        next90Days.setDate(currentDate.getDate() + 90);
        return eventDateObj >= currentDate && eventDateObj <= next90Days;
      default:
        return true;
    }
  };

  const filteredEvents = eventsData.filter(event => {
    const matchesLocation = selectedLocation === 'All' || event.location === selectedLocation;
    const matchesDateRange = selectedDateRange === 'All' || filterByDateRange(event.date);
    return matchesLocation && matchesDateRange;
  });

  const handleBookClick = (event) => {
    setSelectedEvent(event);
    setBookingConfirmed(false);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleConfirmBooking = () => {
    setBookingConfirmed(true);
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
      <div className="events-list">
        {filteredEvents.map((event, index) => (
          <div key={index} className="event-card">
            <h2>{event.title}</h2>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {event.time}</p>
            <p>{event.description}</p>
            <button className="event-button" onClick={() => handleBookClick(event)}>Book</button>
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
