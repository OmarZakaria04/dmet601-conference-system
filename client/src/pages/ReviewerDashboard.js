import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReviewerDashboard.css";

const ReviewerDashboard = () => {
  const [papers, setPapers] = useState([]);
  const reviewerEmail = "reviewer4@conference.com";
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  return (
    <div className="container">
      <h2 className="title">Reviewer Dashboard</h2>
      {papers.length === 0 ? (
        <p>No assigned papers found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Title</th>
              <th className="border p-2">PDF</th>
            </tr>
          </thead>
          <tbody>
            {papers.map((paper, index) => (
              <tr key={index}>
                <td className="border p-2">{paper.title}</td>
                <td className="border p-2">
                  <button
                    className="reviewButton"
                    onClick={() => navigate(`/review/${paper.paperId}`, { state: { reviewerEmail } })}
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
  );
};

export default ReviewerDashboard;
