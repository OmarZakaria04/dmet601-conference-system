import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReviewerDashboard.css";
import Header from "../components/Header";

const ReviewerDashboard = () => {
  const [papers, setPapers] = useState([]);
  const reviewerEmail = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  useEffect(() => {
    if (!reviewerEmail) {
      window.location.href = "/login";
      return;
    }

    fetch(`/api/reviewers/by-email/${reviewerEmail}`)
      .then((res) => res.json())
      .then((reviewer) => {
        if (!reviewer.PDF_IDs || reviewer.PDF_IDs.length === 0) {
          setPapers([]);
          return;
        }
        setPapers(reviewer.PDF_IDs);
      })
      .catch((err) => {
        console.error("Error fetching reviewer data:", err);
      });
  }, [reviewerEmail]);

  return (
    <div className="reviewer-dashboard">
      <Header />
      <div className="reviewer-container">
        <h2 className="dashboard-title">Reviewer Dashboard</h2>

        {papers.length === 0 ? (
          <p className="no-papers">No assigned papers found.</p>
        ) : (
          <table className="paper-table">
            <thead>
              <tr>
                <th>Paper Title</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {papers.map((paper, index) => (
                <tr key={index}>
                  <td>{paper.title}</td>
                  <td>
                    <button
                      className="review-btn"
                      onClick={() =>
                        navigate(`/review/${paper.paperId}`, {
                          state: { reviewerEmail },
                        })
                      }
                    >
                      Review Paper
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReviewerDashboard;
