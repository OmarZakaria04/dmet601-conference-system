import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "./ChairDashboard.css";

const ChairDashboard = () => {
  return (
    <div className="chair-dashboard">
      <Header />
      <h2>Chair Dashboard</h2>
      <div className="button-container">
        <Link to="/assignpdf">
          <button className="chair-button">Assign PDF to Reviewers</button>
        </Link>
        <Link to="/checkfeedback">
          <button className="chair-button">Check Reviewers' Feedback</button>
        </Link>
      </div>
    </div>
  );
};

export default ChairDashboard;
