import React, { useState } from "react";
import "./form.css";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

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
  const role = data.user.role;

  if (role === "author") {
    window.location.href = "/submit";
  } else if (role === "reviewer") {
    window.location.href = "/reviewerdashboard";
  } else if (role === "chair") {
    window.location.href = "/chairdashboard";
  } else {
    alert("Unknown role. Please contact support.");
  }
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
    </form>
  );
}

export default LoginPage;
