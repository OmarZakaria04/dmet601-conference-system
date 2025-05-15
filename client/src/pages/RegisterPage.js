import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./form.css";

function RegisterPage() {
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
        navigate("/login"); // ✅ Automatically redirect after success
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Register</h2>
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

      <div>
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
        <label style={{ marginLeft: "20px" }}>
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

      <button type="submit">Register</button>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
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
          Sign In
        </button>
      </div>
    </form>
  );
}

export default RegisterPage;
