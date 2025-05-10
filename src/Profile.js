import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import "./Profile.css";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    email: user.email,
    username: user.username,
    phone_number: user.phone_number,
  });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(user.profilePic);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePicFile(file);
    setProfilePicPreview(URL.createObjectURL(file));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", profileForm.email);
    formData.append("username", profileForm.username);
    formData.append("phone_number", profileForm.phone_number);
    // Append the profile picture file if one was selected
    if (profilePicFile) {
      formData.append("profilePicFile", profilePicFile);
    } else {
      // If no new file is selected, send the current URL as fallback.
      formData.append("profilePic", profilePicPreview);
    }
    try {
      const response = await fetch("http://127.0.0.1:5000/updateProfile", {
        method: "PUT",
        body: formData,
      });
      const result = await response.json();
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

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {editingProfile ? (
        <form onSubmit={handleProfileUpdate}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={profileForm.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={profileForm.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="text"
              name="phone_number"
              value={profileForm.phone_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Profile Picture:</label>
            <input type="file" onChange={handleProfilePicChange} />
            {profilePicPreview && (
              <img
                src={profilePicPreview}
                alt="Profile Preview"
                className="profile-pic-preview"
              />
            )}
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditingProfile(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div className="profile-details">
          <p>Email: {user.email}</p>
          <p>Username: {user.username}</p>
          <p>Phone Number: {user.phone_number}</p>
          <img src={user.profilePic} alt="Profile" className="profile-pic" />
          <button onClick={() => setEditingProfile(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default Profile;