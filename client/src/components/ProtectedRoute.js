import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRoles }) => {
  const userEmail = localStorage.getItem("userEmail");
  const userRole = localStorage.getItem("userRole");

  // Not logged in
  if (!userEmail || !userRole) {
    return <Navigate to="/" replace />;
  }

  // Logged in but role is not allowed
  if (requiredRoles && !requiredRoles.includes(userRole)) {
   return <Navigate to="/not-authorized" replace />;

  }

  return children;
};

export default ProtectedRoute;
