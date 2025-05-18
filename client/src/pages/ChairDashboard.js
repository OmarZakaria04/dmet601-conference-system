import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "./ChairDashboard.css";

const ChairDashboard = () => {
  return (
    <div className="chair-dashboard">
      <Header />
      <div className="dashboard-content">
        <h2 className="dashboard-title">Chair Dashboard</h2>
        <div className="button-container">
          <Link to="/assignpdf" className="chair-link">
            <button className="chair-button">📄 Assign PDF to Reviewers</button>
          </Link>
          <Link to="/checkfeedback" className="chair-link">
            <button className="chair-button">📝 Check Reviewers' Feedback</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChairDashboard;
