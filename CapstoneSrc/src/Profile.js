import React, { useState, useContext, useEffect } from 'react';
import './Profile.css';
import { AuthContext } from "./AuthContext";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  // New state for profile pic editing:
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(user && user.profilePic ? user.profilePic : "p1.jpg");

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: user ? user.username : '',
    email: user ? user.email : '',
    phone_number: user ? user.phone_number : ''
  });
  
  // New state for bio editing
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(user && user.bio ? user.bio : "This is your bio. Update it in your settings.");

  // Manage projects as editable state
  const defaultProjects = [
    { name: 'Project A', details: 'Developed a web application for managing tasks and projects.' },
    { name: 'Project B', details: 'Worked on a mobile app for tracking fitness activities.' },
    { name: 'Project C', details: 'Collaborated on an e-commerce platform for small businesses.' },
    { name: 'Future Project', details: 'Planning to develop an AI-based recommendation system.' }
  ];
  const [userProjects, setUserProjects] = useState(defaultProjects);
  const [editingProjects, setEditingProjects] = useState(false);

  const [selectedConnection, setSelectedConnection] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAllProjects, setShowAllProjects] = useState(false);

  const connections = [
    { name: 'Jane Smith', img: 'p1.jpg', details: 'Jane is a project manager at XYZ Corp.' },
    { name: 'Mike Johnson', img: 'p1.jpg', details: 'Mike is a software developer at ABC Inc.' }
  ];

  const testimonials = [
    { name: 'Alice Brown', feedback: 'John is an exceptional engineer with a keen eye for detail.' },
    { name: 'Bob Green', feedback: 'Working with John was a pleasure. He is very knowledgeable and professional.' },
    { name: 'Charlie Black', feedback: 'John consistently delivers high-quality work on time.' }
  ];

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username,
        email: user.email,
        phone_number: user.phone_number
      });
      if(user.bio) setBio(user.bio);
      if(user.profilePic) setProfilePicPreview(user.profilePic);
    }
  }, [user]);

  useEffect(() => {
    if(user) {
      fetch("http://localhost:5000/users")
        .then(res => res.json())
        .then(data => {
          const users = data.users || [];
          let filtered = users.filter(u => u.email !== user.email);
          // Force mock suggestions regardless of fetched data:
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
          setSuggestions([
            { id: "1", username: "AliceWonder", email: "alice@example.com", profilePic: "p1.jpg" },
            { id: "2", username: "BobBuilder", email: "bob@example.com", profilePic: "p1.jpg" },
            { id: "3", username: "CharlieChaplin", email: "charlie@example.com", profilePic: "p1.jpg" },
            { id: "4", username: "DianaPrince", email: "diana@example.com", profilePic: "p1.jpg" },
            { id: "5", username: "EdwardScissorhands", email: "edward@example.com", profilePic: "p1.jpg" }
          ]);
        });
    }
  }, [user]);

  const handleConnectionClick = (connection) => setSelectedConnection(connection);
  const handleProjectClick = (project) => setSelectedProject(project);
  const handleCloseDetails = () => {
    setSelectedConnection(null);
    setSelectedProject(null);
  };
  const handleShowMoreProjects = () => setShowAllProjects(!showAllProjects);

  const handleFormChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePicFile(file);
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      ...profileForm,
      profilePic: profilePicPreview // For demo, sending URL (simulate upload result)
    };
    console.log("Updating profile with data:", payload); // Debug log payload
    try {
      const response = await fetch("http://127.0.0.1:5000/updateProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      console.log("Response status:", response.status); // Debug response status
      const result = await response.json();
      console.log("Response data:", result); // Debug response data
      if (response.ok) {
        setUser(result.user);
        setEditingProfile(false);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  // Handlers for editing bio
  const handleBioSave = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/updateBio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio })
      });
      const result = await response.json();
      if(response.ok) {
        setUser(prev => ({ ...prev, bio }));
        setEditingBio(false);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error updating bio:", error);
      alert("Failed to update bio");
    }
  };

  // Handlers for editing projects list
  const handleProjectChange = (index, field, value) => {
    const newProjects = [...userProjects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setUserProjects(newProjects);
  };

  const handleProjectsSave = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/updateProjects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: userProjects })
      });
      const result = await response.json();
      if(response.ok) {
        setEditingProjects(false);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error updating projects:", error);
      alert("Failed to update projects");
    }
  };

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
        setSuggestions(prev => prev.filter(sug => sug.email !== suggestionEmail));
      })
      .catch(err => console.error("Error connecting:", err));
  };

  return (
    <div className="wrapper">
      <div className="profile-container">
        <div className="profile-header">
          {/* Use edited profile pic preview */}
          <img src={profilePicPreview} alt="Profile" className="profile-pic" />
          <div className="profile-info">
            {editingProfile ? (
              <form onSubmit={handleProfileUpdate} className="edit-form">
                <input
                  type="text"
                  name="username"
                  value={profileForm.username}
                  onChange={handleFormChange}
                  placeholder="Username"
                  required
                  className="edit-input"
                />
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleFormChange}
                  placeholder="Email"
                  required
                  className="edit-input"
                />
                <input
                  type="text"
                  name="phone_number"
                  value={profileForm.phone_number}
                  onChange={handleFormChange}
                  placeholder="Phone Number"
                  required
                  className="edit-input"
                />
                {/* New file input for profile pic */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="edit-input"
                />
                <div className="edit-buttons">
                  <button type="submit" className="edit-btn save-btn">Save</button>
                  <button type="button" onClick={() => setEditingProfile(false)} className="edit-btn cancel-btn">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <h1>{user ? user.username : "Guest"}</h1>
                <p>{user ? "@" + user.username : "@guest"}</p>
                <p>{user ? `Email: ${user.email}` : "No email available"}</p>
                <p>{user ? `Phone: ${user.phone_number}` : "No phone available"}</p>
                {user && (
                  <button onClick={() => setEditingProfile(true)} className="edit-btn default-edit-btn">
                    Edit Profile
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        <div className="profile-bio">
          <h2>Bio</h2>
          {editingBio ? (
            <>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={4}
                className="edit-textarea"
              />
              <div className="edit-buttons">
                <button onClick={handleBioSave} className="edit-btn save-btn">Save Bio</button>
                <button onClick={() => setEditingBio(false)} className="edit-btn cancel-btn">Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p>{bio}</p>
              {user && <button onClick={() => setEditingBio(true)} className="edit-btn default-edit-btn">Edit Bio</button>}
            </>
          )}
        </div>
        <div className="profile-projects">
          <h2>Projects</h2>
          {editingProjects ? (
            <>
              <ul className="project-list">
                {userProjects.map((project, index) => (
                  <li key={index} className="project-item">
                    <input
                      type="text"
                      value={project.name}
                      onChange={e => handleProjectChange(index, 'name', e.target.value)}
                      required
                      className="edit-input"
                    />
                    <textarea
                      value={project.details}
                      onChange={e => handleProjectChange(index, 'details', e.target.value)}
                      rows={2} // Keep a low number of rows so height stays small
                      style={{ width: "100%" }} // Expand the textarea horizontally
                      className="edit-textarea"
                      required
                    />
                  </li>
                ))}
              </ul>
              <div className="edit-buttons">
                <button onClick={handleProjectsSave} className="edit-btn save-btn">Save Projects</button>
                <button onClick={() => setEditingProjects(false)} className="edit-btn cancel-btn">Cancel</button>
              </div>
            </>
          ) : (
            <>
              <ul className="project-list">
                {userProjects.slice(0, showAllProjects ? userProjects.length : 2).map((project, index) => (
                  <li
                    key={index}
                    className="project-item"
                    onClick={() => setSelectedProject(project)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={() => setSelectedProject(project)}
                  >
                    <h3>{project.name}</h3>
                    <p>{project.details}</p>
                  </li>
                ))}
              </ul>
              <div className="project-buttons">
                {userProjects.length > 2 && (
                  <button className="show-more-button" onClick={() => setShowAllProjects(!showAllProjects)}>
                    {showAllProjects ? 'Show Less' : 'Show More'}
                  </button>
                )}
                {user && (
                  <button onClick={() => setEditingProjects(true)} className="edit-btn default-edit-btn">
                    Edit Projects
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        <div className="profile-connections">
          <h2>Connections</h2>
          {user ? (
            <p>Your connections will appear here.</p>
          ) : (
            <p>Please sign in to see your connections.</p>
          )}
        </div>
        <div className="profile-suggestions" style={{ marginTop: '20px' }}>
          <h2 style={{ marginBottom: '15px' }}>Suggested Profiles</h2>
          {suggestions.map(sug => (
            <div key={sug.id} className="suggestion-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', padding: '5px 0' }}>
              <img src={sug.profilePic || "p1.jpg"} alt={sug.username} className="suggestion-img" />
              <div style={{ flex: 1, paddingLeft: '10px' }}>
                <span>{sug.username}</span>
              </div>
              <button onClick={() => handleConnect(sug.email)} style={{ fontSize: '0.8rem', padding: '4px 8px' }}>
                Connect
              </button>
            </div>
          ))}
        </div>
        {(selectedConnection || selectedProject) && (
          <div className="details-modal">
            <button className="close-button" onClick={handleCloseDetails}>Close</button>
            {selectedConnection && (
              <>
                <h2>{selectedConnection.name}</h2>
                <p>{selectedConnection.details}</p>
              </>
            )}
            {selectedProject && (
              <>
                <h2>{selectedProject.name}</h2>
                <p>{selectedProject.details}</p>
              </>
            )}
          </div>
        )}
      </div>
      <div className="additional-content">
        <h2>What Others Think</h2>
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial">
            <p><strong>{testimonial.name}:</strong> {testimonial.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;