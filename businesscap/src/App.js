import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './App.css';
import Sign from './Sign';
import Profile from './Profile';
import Events from './Events'; // Import the Events component

const App = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Set default dark mode to true
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const settingsRef = useRef(null);
  const videoRef = useRef(null);

  const videos = ['test3.mp4', 'test4.mp4', 'test5.mp4']; // List of video sources

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
    document.body.classList.add('dark-mode'); // Ensure dark mode is applied on mount

    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, 10000); // Change video every 10 seconds

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearInterval(interval);
    };
  }, [videos.length]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [currentVideoIndex]);

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="logo">Ideology</div>
          <ul className="nav-links">
            <li><Link to="/#feed">Home</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/sign" className="nav-link">Sign In/Up</Link></li>
            <li className="settings-container" ref={settingsRef}>
              <Link to="#" className="nav-link" onClick={toggleSettings}>Settings</Link>
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
        <Switch>
          <Route path="/sign" component={Sign} />
          <Route path="/profile" component={Profile} />
          <Route path="/events" component={Events} /> {/* Add the Events route */}
          <Route path="/">
            <header className="App-header">
              <div className="hero">
                <video ref={videoRef} autoPlay muted loop className="background-video">
                  <source src={videos[currentVideoIndex]} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="overlay"></div>
                <div className="hero-content">
                  <h1>Welcome to <span className="glow">Ideology</span></h1>
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
            <main className="main-content">
              <section id="feed" className="feed">
                <h2>Infinite Feed</h2>
                <p>Discover new ideas and engage with a thriving network of professionals.</p>
              </section>
              <section id="profile" className="profile">
                <h2>Your Profile</h2>
                <p>Build your professional identity and showcase your achievements.</p>
              </section>
              <section id="events" className="events">
                <h2>Events</h2>
                <div className="event">
                  <h3>Networking Event</h3>
                  <p>Join us for a networking event to connect with professionals in your field.</p>
                  <p>Date: March 15, 2025</p>
                </div>
                <div className="event">
                  <h3>Workshop: Building Your Brand</h3>
                  <p>Learn how to build and promote your personal brand.</p>
                  <p>Date: April 10, 2025</p>
                </div>
                <div className="event">
                  <h3>Webinar: Future of AI</h3>
                  <p>Explore the future of AI and its impact on various industries.</p>
                  <p>Date: May 5, 2025</p>
                </div>
              </section>
              <section id="posts" className="posts">
                <h2>Recent Posts</h2>
                <div className="post">
                  <h3>John Doe</h3>
                  <p>Excited to share my latest project on sustainable energy solutions!</p>
                </div>
                <div className="post">
                  <h3>Jane Smith</h3>
                  <p>Looking for collaborators on a new AI research paper. DM me if interested!</p>
                </div>
                <div className="post">
                  <h3>Michael Brown</h3>
                  <p>Just published a new article on blockchain technology. Check it out!</p>
                </div>
              </section>
              <section id="projects" className="projects">
                <h2>Featured Projects</h2>
                <div className="project">
                  <h3>Project A</h3>
                  <p>An innovative solution to reduce carbon footprint in urban areas.</p>
                </div>
                <div className="project">
                  <h3>Project B</h3>
                  <p>A mobile app to help users track and improve their mental health.</p>
                </div>
                <div className="project">
                  <h3>Project C</h3>
                  <p>A platform to connect freelancers with potential clients.</p>
                </div>
              </section>
              <section id="trending" className="trending">
                <h2>Trending Topics</h2>
                <div className="topic">
                  <h3>Remote Work</h3>
                  <p>Discussions on the future of remote work and its impact on productivity.</p>
                </div>
                <div className="topic">
                  <h3>Blockchain Technology</h3>
                  <p>Exploring the potential of blockchain in various industries.</p>
                </div>
                <div className="topic">
                  <h3>Artificial Intelligence</h3>
                  <p>Latest advancements and applications of AI in different fields.</p>
                </div>
              </section>
              <section id="connections" className="connections">
                <h2>Recommended Connections</h2>
                <div className="connection">
                  <h3>Emily Johnson</h3>
                  <p>Software Engineer at TechCorp</p>
                </div>
                <div className="connection">
                  <h3>Michael Brown</h3>
                  <p>Data Scientist at DataWorks</p>
                </div>
                <div className="connection">
                  <h3>Sarah Williams</h3>
                  <p>Product Manager at Innovatech</p>
                </div>
              </section>
            </main>
          </Route>
        </Switch>
        <footer className="App-footer">
          <p>&copy; 2023 Business Connect. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
