// RegisterPageStyled.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

function RegisterPageStyled() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        navigate("/");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div className="register-full-container">
      <div className="register-image-section">
        <img src="/signup-illustration.png" alt="Sign up illustration" className="register-graphic" />
      </div>
      <div className="register-form-section">
        <h2 className="register-title">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="register-form-box">
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
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

          <div className="role-section">
            <label>
              <input
                type="radio"
                name="role"
                value="user"
                checked={form.role === "user"}
                onChange={handleChange}
              />
              User
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="author"
                checked={form.role === "author"}
                onChange={handleChange}
              />
              Author
            </label>
          </div>

          <button type="submit" className="register-button">Register</button>

          <div className="login-redirect">
            Already have an account?
            <button
              type="button"
              onClick={() => navigate("/")}
              className="signin-link"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPageStyled;
