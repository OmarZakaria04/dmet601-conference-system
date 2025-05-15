import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate hook
import "./form.css";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // ✅ Use navigate hook

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
        window.location.href = "/submit";
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
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Login</h2>
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
      <button type="submit">Login</button>

      {/* ✅ Added register link */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          style={{
            color: "blue",
            textDecoration: "underline",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            marginLeft: "5px"
          }}
        >
          Register
        </button>
      </div>
    </form>
  );
}

export default LoginPage;
