import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("userRole");
  const email = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="header">
      <div className="user-info">
        👤 {email || "Unknown User"} ({role || "No Role"})
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Header;
