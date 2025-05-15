import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userEmail = localStorage.getItem("userEmail");

  if (!userEmail) {
    // If no user is logged in, redirect to login page
    return <Navigate to="/" replace />;
  }

  // Otherwise, allow access
  return children;
};

export default ProtectedRoute;
