import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "", // Match the backend schema
    phone_number: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData); // Log the form data for debugging
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("Response Status:", response.status); // Log the response status
      const result = await response.json();
      console.log("Response Data:", result); // Log the response data

      if (response.ok) {
        toast.success(result.message, { autoClose: 2000 });
        // Removed navigation to sign in to avoid auto-sign in.
        // navigate("/sign");
      } else {
        toast.error(result.message, { autoClose: 2000 });
      }
    } catch (error) {
      console.error("Error:", error);
      // Display detailed error message coming from the backend if available
      toast.error("Registration failed: " + (error.message || "Unknown error"), { autoClose: 2000 });
    }
  };

  const handleLogin = () => {
    navigate("/sign"); // Navigate to the sign page when the login button is clicked
  };

  return (
    <div className="register-container">
      <ToastContainer />  
      <div className="register-box">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="UserName" onChange={handleChange} required />
          <input type="text" name="phone_number" placeholder="Phone Number" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Register</button>
        </form>
        <p className="login-link">
          Already have an account? <span className="login-link-text" onClick={handleLogin}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;