import React, { useState, useEffect, useRef, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Replace Switch with Routes
import './App.css';
import Sign from './Sign';
import Profile from './Profile';
import Events from './Events'; // Import the Events component
import Register from './Register'; // Import the Register component
import CreatePost from './CreatePost'; // Import the Create Post component
import Feed from './Feed';  // Import the new Feed component
import { FaHome, FaUser, FaCalendarAlt, FaSignInAlt, FaCog, FaPencilAlt, FaHeart, FaComment, FaShare, FaRss } from 'react-icons/fa'; // Add icons
import { AuthProvider, AuthContext } from './AuthContext';
import { PostProvider, PostContext } from './PostContext'; // Updated import path

// New PostItem component for like, comment, and share functionality
const PostItem = ({ post }) => {
  const { user } = useContext(AuthContext); // Access current user's info
  const [likes, setLikes] = useState(post.likes || 0);
  const [comments, setComments] = useState(post.comments || []);
  
  const handleLike = () => setLikes(likes + 1);
  const handleComment = () => {
    const commentText = prompt("Enter your comment:");
    if (commentText) {
      const commentAuthor = user ? user.username : "Anonymous";
      setComments([...comments, { author: commentAuthor, text: commentText }]);
    }
  };
  const handleShare = () => alert("Post shared!");
  
  const isVideo = post.mediaURL && 
    (post.mediaURL.toLowerCase().endsWith('.mp4') || 
     post.mediaURL.toLowerCase().endsWith('.webm') || 
     post.mediaURL.toLowerCase().endsWith('.ogg'));

  return (
    <div className="post">
      <div className="post-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="p1.jpg" alt="Profile" className="post-profile-pic" />
          <h3 className="post-author">{post.author}</h3>
        </div>
        <button className="connect-button">Connect</button>
      </div>
      <div className="post-content">
        {post.mediaURL ? (
          isVideo ? (
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              controls 
              style={{ maxWidth: '100%', height: 'auto', backgroundColor: 'black' }}
              onError={(e) => console.error("Video playback error", e)}
            >
              <source src={post.mediaURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={post.mediaURL} alt="Post content" className="post-image" />
          )
        ) : (
          <img src="test.jpg" alt="Post content" className="post-image" />
        )}
        <p className="post-text">{post.content}</p>
        {comments.length > 0 && (
          <div className="post-comments">
            {comments.map((comment, idx) => (
              <p key={idx} className="comment">
                <strong>{comment.author}:</strong> {comment.text}
              </p>
            ))}
          </div>
        )}
      </div>
      <div className="post-actions">
        <button onClick={handleLike} className="like-button">
          <FaHeart /> Like ({likes})
        </button>
        <button onClick={handleComment} className="comment-button">
          <FaComment /> Comment
        </button>
        <button onClick={handleShare} className="share-button">
          <FaShare /> Share
        </button>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { user, logout } = useContext(AuthContext);
  const { posts } = useContext(PostContext);
  const [suggestions, setSuggestions] = useState([]);
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

  // Fetch suggestions from backend (all users)
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => {
        const users = data.users || [];
        let filtered = user ? users.filter(u => u.email !== user.email) : users;
        // Always show mock profiles by overriding the suggestions array
        filtered = [
          { id: "1", username: "AliceWonder", email: "alice@example.com", profilePic: "p1.jpg" },
          { id: "2", username: "BobBuilder", email: "bob@example.com", profilePic: "p1.jpg" },
          { id: "3", username: "CharlieChaplin", email: "charlie@example.com", profilePic: "p1.jpg" },
          { id: "4", username: "DianaPrince", email: "diana@example.com", profilePic: "p1.jpg" },
          { id: "5", username: "EdwardScissorhands", email: "edward@example.com", profilePic: "p1.jpg" }
        ];
        setSuggestions(filtered);
      })
      .catch(err => {
        console.error("Error fetching suggestions:", err);
        // Fallback to mock profiles if any error occurs
        setSuggestions([
          { id: "1", username: "AliceWonder", email: "alice@example.com", profilePic: "p1.jpg" },
          { id: "2", username: "BobBuilder", email: "bob@example.com", profilePic: "p1.jpg" },
          { id: "3", username: "CharlieChaplin", email: "charlie@example.com", profilePic: "p1.jpg" },
          { id: "4", username: "DianaPrince", email: "diana@example.com", profilePic: "p1.jpg" },
          { id: "5", username: "EdwardScissorhands", email: "edward@example.com", profilePic: "p1.jpg" }
        ]);
      });
  }, [user]);

  const handleConnect = (suggestionEmail) => {
    if (!user) return;
    fetch("http://localhost:5000/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        followerEmail: user.email, 
        followeeEmail: suggestionEmail 
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        // Optionally remove connected suggestion:
        setSuggestions(prev => prev.filter(sug => sug.email !== suggestionEmail));
      })
      .catch(err => console.error("Error connecting:", err));
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo glow">BizCon</div>
        <ul className="nav-links">
          <li>
            <Link to="/#feed">
              <FaHome className="nav-icon" /> Home
            </Link>
          </li>
          <li>
            <Link to="/feed">
              <FaRss className="nav-icon" /> Feed
            </Link>
          </li>
          { user ? (
            <>
              <li>
                <Link to="/profile">
                  <FaUser className="nav-icon" /> {user.username}
                </Link>
              </li>
              <li>
                <Link to="/create-post">
                  <FaPencilAlt className="nav-icon" /> Create Post
                </Link>
              </li>
            </>
          ) : null }
          <li>
            <Link to="/events">
              <FaCalendarAlt className="nav-icon" /> Events
            </Link>
          </li>
          <li>
            {user ? (
              <button 
                onClick={logout} 
                className="nav-link button-link">
                <FaSignInAlt className="nav-icon" /> Logout
              </button>
            ) : (
              <Link to="/sign" className="nav-link">
                <FaSignInAlt className="nav-icon" /> Sign In/Up
              </Link>
            )}
          </li>
          <li className="settings-container" ref={settingsRef}>
            <Link to="#" className="nav-link" onClick={toggleSettings}>
              <FaCog className="nav-icon" /> Settings
            </Link>
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
      <Routes> {/* Replace Switch with Routes */}
        <Route path="/sign" element={<Sign />} /> {/* Update Route syntax */}
        <Route path="/profile" element={<Profile />} /> {/* Update Route syntax */}
        <Route path="/events" element={<Events />} /> {/* Update Route syntax */}
        <Route path="/register" element={<Register />} /> {/* Add Register route */}
        <Route path="/create-post" element={<CreatePost />} />  {/* New route for creating a post */}
        <Route path="/feed" element={<Feed />} />
        <Route path="/" element={
          <>
            <header className="App-header">
              <div className="hero">
                <video ref={videoRef} autoPlay muted loop className="background-video">
                  <source src={videos[currentVideoIndex]} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="overlay"></div>
                <div className="hero-content">
                  <h1>Welcome to <span className="glow">BizCon</span></h1>
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
            <main className="home-content" style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",  // Reduced gap between sections
              padding: "0 10px" // Reduced horizontal padding
            }}>
              {/* Row container: Testimonials and Trending Posts side by side */}
              <div className="row-container" style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "15px",
                justifyContent: "space-around"
              }}>
                <section className="testimonials" style={{
                  flex: "1 1 350px", // reduced flex-basis
                  padding: "15px",
                  backgroundColor: "var(--navbar-background-color)",
                  color: "var(--navbar-text-color)",
                  margin: "10px auto",
                  maxWidth: "800px", // reduced max width
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                  <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: "2.2rem" }}>What Users Say</h2>
                  <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "20px" }}>
                    <div style={{ flex: "1 1 250px", padding: "20px", backgroundColor: "var(--background-color)", borderRadius: "8px" }}>
                      <p>"BizCon has transformed the way I network professionally. Highly recommended!"</p>
                      <p style={{ fontWeight: "bold", textAlign: "right" }}>- Alex</p>
                    </div>
                    <div style={{ flex: "1 1 250px", padding: "20px", backgroundColor: "var(--background-color)", borderRadius: "8px" }}>
                      <p>"A remarkable platform for collaboration and innovation. My go-to resource for networking."</p>
                      <p style={{ fontWeight: "bold", textAlign: "right" }}>- Jamie</p>
                    </div>
                    {/* New Review 1 */}
                    <div style={{ flex: "1 1 250px", padding: "20px", backgroundColor: "var(--background-color)", borderRadius: "8px" }}>
                      <p>"This platform helped me land my dream job by connecting me with the right people."</p>
                      <p style={{ fontWeight: "bold", textAlign: "right" }}>- Liam</p>
                    </div>
                    {/* New Review 2 */}
                    <div style={{ flex: "1 1 250px", padding: "20px", backgroundColor: "var(--background-color)", borderRadius: "8px" }}>
                      <p>"An exceptional network that fuels innovation and personal growth."</p>
                      <p style={{ fontWeight: "bold", textAlign: "right" }}>- Sophia</p>
                    </div>
                  </div>
                </section>
                <section className="trending-posts" style={{
                  flex: "1 1 350px",
                  padding: "15px",
                  backgroundColor: "var(--navbar-background-color)",
                  color: "var(--navbar-text-color)",
                  margin: "10px auto",
                  maxWidth: "800px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                  <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: "2.2rem" }}>Trending Posts</h2>
                  <p style={{ textAlign: "center" }}>Check out what's trending across our network!</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px", padding: "20px 0" }}>
                    {/* Sample Post 1 */}
                    <div style={{ backgroundColor: "var(--card-background-color)", padding: "10px", borderRadius: "8px" }}>
                      <h4>Innovative Tech Launch</h4>
                      <p>Discover cutting-edge gadgets and apps making headlines today.</p>
                    </div>
                    {/* Sample Post 2 */}
                    <div style={{ backgroundColor: "var(--card-background-color)", padding: "10px", borderRadius: "8px" }}>
                      <h4>Business Growth Tips</h4>
                      <p>Learn expert strategies to boost your business growth and efficiency.</p>
                    </div>
                    {/* Sample Post 3 */}
                    <div style={{ backgroundColor: "var(--card-background-color)", padding: "10px", borderRadius: "8px" }}>
                      <h4>Startup Success Story</h4>
                      <p>Read how an emerging startup turned obstacles into opportunities.</p>
                    </div>
                  </div>
                </section>
              </div>
              {/* New container for About Us and Join BizCon side-by-side */}
              <div className="about-join-container" style={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                alignItems: "flex-start",
                flexWrap: "nowrap"
              }}>
                <section className="about-us" style={{
                  flex: "2",
                  padding: "25px 15px",
                  backgroundColor: "var(--navbar-background-color)",
                  color: "var(--navbar-text-color)",
                  borderRadius: "15px",
                  margin: "10px auto",
                  maxWidth: "850px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  textAlign: "center"
                }}>
                  <h2 style={{ marginBottom: "40px", fontSize: "3rem", letterSpacing: "1.5px" }}>About Us</h2>
                  <div className="about-us-sections" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "40px" }}>
                    <div className="about-section" style={{
                      flex: "1 1 300px",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      padding: "30px",
                      borderRadius: "12px",
                      textAlign: "left"
                    }}>
                      <h3 style={{ marginBottom: "20px", fontSize:"2rem", borderBottom:"2px solid white", paddingBottom:"10px" }}>Our Mission</h3>
                      <p style={{ fontSize:"1.2rem", lineHeight:"1.8" }}>
                        We empower professionals worldwide to connect, innovate, and succeed through meaningful collaboration.
                      </p>
                    </div>
                    <div className="about-section" style={{
                      flex: "1 1 300px",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      padding: "30px",
                      borderRadius: "12px",
                      textAlign: "left"
                    }}>
                      <h3 style={{ marginBottom: "20px", fontSize:"2rem", borderBottom:"2px solid white", paddingBottom:"10px" }}>Our Vision</h3>
                      <p style={{ fontSize:"1.2rem", lineHeight:"1.8" }}>
                        To be the pioneering platform where business connections transform ideas into reality in a dynamic digital world.
                      </p>
                    </div>
                    <div className="about-section" style={{
                      flex: "1 1 300px",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      padding: "30px",
                      borderRadius: "12px",
                      textAlign: "left"
                    }}>
                      <h3 style={{ marginBottom: "20px", fontSize:"2rem", borderBottom:"2px solid white", paddingBottom:"10px" }}>Our Values</h3>
                      <ul style={{ listStyleType: "disc", paddingLeft: "30px", fontSize:"1.2rem", lineHeight:"1.8" }}>
                        <li>Innovation</li>
                        <li>Collaboration</li>
                        <li>Integrity</li>
                      </ul>
                    </div>
                  </div>
                </section>
                <section className="cta" style={{
                  flex: "1",
                  padding: "25px",
                  backgroundColor: "var(--navbar-background-color)",
                  color: "var(--navbar-text-color)",
                  borderRadius: "10px",
                  margin: "10px auto",
                  maxWidth: "400px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  textAlign: "center"
                }}>
                  <h2 style={{ marginBottom: "20px", fontSize: "2.5rem" }}>Join BizCon Today!</h2>
                  <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
                    Sign up now to connect with professionals, share ideas, and explore opportunities!
                  </p>
                  <button style={{
                    padding: "15px 30px",
                    fontSize: "1.2rem",
                    backgroundColor: "white",
                    color: "var(--primary-color)",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}>Get Started</button>
                </section>
              </div>
              {/* Row container: How It Works and FAQ side by side */}
              <div className="row-container" style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px", // reduced gap
                justifyContent: "space-around"
              }}>
                <section className="how-it-works" style={{
                  flex: "1 1 250px",         // reduced flex basis
                  padding: "10px",            // reduced padding
                  maxWidth: "600px",          // reduced maximum width
                  backgroundColor: "var(--navbar-background-color)",
                  color: "var(--navbar-text-color)",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  textAlign: "center",
                  height: "auto"             // ensure the height auto-adjusts
                }}>
                  <h2 style={{ marginBottom: "30px", fontSize: "2.5rem" }}>How It Works</h2>
                  <div style={{ display: "flex", justifyContent: "space-around", gap: "20px", flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 250px", padding: "20px", backgroundColor: "var(--card-background-color)", borderRadius: "8px" }}>
                      <h3>Step 1: Sign Up</h3>
                      <p>Create your account in a few simple clicks to join our network.</p>
                    </div>
                    <div style={{ flex: "1 1 250px", padding: "20px", backgroundColor: "var(--card-background-color)", borderRadius: "8px" }}>
                      <h3>Step 2: Connect</h3>
                      <p>Find and connect with like-minded professionals effortlessly.</p>
                    </div>
                    <div style={{ flex: "1 1 250px", padding: "20px", backgroundColor: "var(--card-background-color)", borderRadius: "8px" }}>
                      <h3>Step 3: Grow</h3>
                      <p>Share ideas, collaborate on projects, and grow your network.</p>
                    </div>
                  </div>
                </section>
                <section className="faq" style={{
                  flex: "1 1 250px",         // reduced flex basis
                  padding: "10px",            // reduced padding
                  maxWidth: "600px",          // reduced maximum width
                  backgroundColor: "var(--navbar-background-color)",
                  color: "var(--navbar-text-color)",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  textAlign: "left",
                  height: "auto"             // ensure the height auto-adjusts
                }}>
                  <h2 style={{ marginBottom: "30px", fontSize: "2.5rem", textAlign:"center" }}>Frequently Asked Questions</h2>
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontSize:"1.5rem" }}>Q: How do I create an account?</h3>
                    <p style={{ fontSize:"1.1rem" }}>A: Click the Register button, fill in your details, and verify your email.</p>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontSize:"1.5rem" }}>Q: Is BizCon free to use?</h3>
                    <p style={{ fontSize:"1.1rem" }}>A: Yes, our network features are free; premium options are available via subscription.</p>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontSize:"1.5rem" }}>Q: How can I connect with professionals?</h3>
                    <p style={{ fontSize:"1.1rem" }}>A: Use our Feed and Search tools to find contacts and send connection requests directly.</p>
                  </div>
                </section>
              </div>
            </main>
          </>
        } />
      </Routes>
      <footer className="App-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="logo glow">BizCon</div>
          </div>
          <div className="footer-details">
            <p><strong>Contact Us:</strong></p>
            <p>Email: contact@ideology.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 1234 Innovation Drive, Tech City, TX 75001</p>
          </div>
        </div>
        <p>&copy; 2025 Business Connect. All rights reserved.</p>
      </footer>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <PostProvider>
        <Router>
          <div className="App">
            <AppContent />
          </div>
        </Router>
      </PostProvider>
    </AuthProvider>
  );
};

export default App;