import React from "react";
import "./NotAuthorizedPage.css";

function NotAuthorizedPage() {
  return (
    <div className="not-authorized-container">
      <h1>Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <a href="/" className="back-home-link">Return to Login</a>
    </div>
  );
}

export default NotAuthorizedPage;
