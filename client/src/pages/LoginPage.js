// LoginPageStyled.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      const { email, role } = data.user;
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", role);

      if (role === "author") {
        window.location.href = "/select-conference";
      } else if (role === "reviewer") {
        window.location.href = "/reviewerdashboard";
      } else if (role === "chair") {
        window.location.href = "/chairdashboard";
      } else if (role === "admin") {
        window.location.href = "/admin";
      } else if (role === "user") {
        window.location.href = "/user";
      } else {
        alert("Unknown role. Please contact support.");
      }
    } else {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-full-container">
      <div className="login-graphic-section">
        <img src="/login-illustration.png" alt="Conference illustration" className="login-graphic" />
      </div>
      <div className="login-form-section">
        <h2 className="system-title">Conference System</h2>
        <form className="login-form-box" onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email address"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-submit-button">Sign in</button>
        </form>
        <p className="forgot-password-link">
          <span onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </span>
        </p>
        <div className="register-line">
          Don't have an account?
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="signup-button"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
