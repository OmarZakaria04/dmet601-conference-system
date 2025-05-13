import React from "react";
import "./status.css"; // optional for styling
import Header from "../components/Header"; // Import Header component

function UserWaitingPage() {
  return (
    <div><Header />
    <div className="status-container">
      <h1>Welcome, User</h1>
      <h2> Please wait to be assigned to a role.</h2>
    </div>
    </div>
  );
}

export default UserWaitingPage;
