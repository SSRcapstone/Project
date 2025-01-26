import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const settingsRef = useRef(null);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  const handleClickOutside = (event) => {
    if (settingsRef.current && !settingsRef.current.contains(event.target)) {
      setIsSettingsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <nav className="navbar">
          <div className="logo">Business Connect</div>
          <ul className="nav-links">
            <li><a href="#feed">Feed</a></li>
            <li><a href="#profile">Profile</a></li>
            <li><a href="#events">Events</a></li>
            <li><a href="#signin" className="nav-link">Sign In/Sign Up</a></li>
            <li className="settings-container" ref={settingsRef}>
              <button className="settings-button" onClick={toggleSettings}>Settings</button>
              {isSettingsOpen && (
                <div className="settings-popup">
                  <label>
                    <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
                    Dark Mode
                  </label>
                </div>
              )}
            </li>
          </ul>
        </nav>
        <div className="hero">
          <video autoPlay muted loop className="background-video">
            <source src="/test.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="overlay"></div>
          <div className="hero-content">
            <h1>Welcome to Business Connect</h1>
            <p>Collaborate with like-minded professionals and turn your ideas into reality.</p>
            <div className="search-bar">
              <select className="dropdown">
                <option value="all">All</option>
                <option value="people">People</option>
                <option value="projects">Projects</option>
                <option value="events">Events</option>
              </select>
              <input type="text" placeholder="Search..." className="search-input" />
              <button className="search-button">Search</button>
            </div>
          </div>
        </div>
      </header>
      <main>
        {/* Add your main content here */}
      </main>
      <footer className="App-footer">
        <p>&copy; 2023 Business Connect. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
