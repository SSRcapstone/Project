import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Sign.css";
import { AuthContext } from "./AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = formData.email.trim().toLowerCase();
    const loginData = { ...formData, email };

    try {
      const response = await fetch("http://localhost:5000/login", { // Changed to localhost
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      console.log("Response Status:", response.status);
      const result = await response.json();
      console.log("Response Data:", result);
      if (response.ok) {
        toast.success(result.message, { autoClose: 2000 });
        setUser(result.user);
        setTimeout(() => navigate("/profile"), 2000);
      } else {
        toast.error(result.message, { autoClose: 2000 });
      }
    } catch (error) {
      console.error("Failed to fetch. Network error:", error);
      toast.error("Failed to fetch. Ensure your backend is running on port 5000.", { autoClose: 2000 });
    }
  };

  const handleNoAccount = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>User Login</h2>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Sign In</button>
        <p>
          Don't have an account?{" "}
          <span className="register-link" onClick={handleNoAccount}>Register</span>
        </p>
      </form>
    </div>
  );
};

export default Login;