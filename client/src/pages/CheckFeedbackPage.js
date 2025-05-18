import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./CheckFeedbackPage.css";

const CheckFeedbackPage = () => {
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [decision, setDecision] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // for Back button

  useEffect(() => {
    fetch("/api/papers/reviewed")
      .then((res) => res.json())
      .then((data) => setPapers(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching papers:", err);
        setPapers([]);
      });
  }, []);

  const handleViewReviews = (paper) => {
    setSelectedPaper(paper);
    fetch(`/api/reviews/by-paper/${paper._id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setReviews([]);
      });
  };

  const handleSubmit = () => {
    if (!selectedPaper || !decision) {
      setMessage("❌ Please select a decision.");
      return;
    }

    fetch("/api/chair-decision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paperId: selectedPaper._id, decision }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message || `✅ Decision "${decision}" recorded for paper "${selectedPaper.title}".`);
        setDecision("");
      })
      .catch((err) => {
        console.error("Error submitting decision:", err);
        setMessage("❌ Error submitting decision.");
      });
  };

  return (
    <div className="check-feedback-page">
      <Header />
      <div className="feedback-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h2>Check Papers & Reviews</h2>
        {message && <p className="message">{message}</p>}

        <table className="papers-table">
          <thead>
            <tr>
              <th>Paper Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {papers.map((paper) => (
              <tr key={paper._id}>
                <td>{paper.title}</td>
                <td>
                  <button className="view-btn" onClick={() => handleViewReviews(paper)}>
                    View Reviews
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedPaper && (
          <div className="review-section">
            <h3>Reviews for: {selectedPaper.title}</h3>
            {reviews.length === 0 ? (
              <p>No reviews found for this paper yet.</p>
            ) : (
              <table className="reviews-table">
                <thead>
                  <tr>
                    <th>Grade</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review, idx) => (
                    <tr key={idx}>
                      <td>{review.grade}</td>
                      <td>{review.feedback}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="decision-group">
              <label>
                <input
                  type="radio"
                  value="Approved"
                  checked={decision === "Approved"}
                  onChange={(e) => setDecision(e.target.value)}
                />
                Approve
              </label>
              <label>
                <input
                  type="radio"
                  value="Declined"
                  checked={decision === "Declined"}
                  onChange={(e) => setDecision(e.target.value)}
                />
                Decline
              </label>
            </div>

            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={reviews.length < 2 || !decision}
            >
              Submit Decision
            </button>

            {reviews.length < 2 && (
              <p className="warning">⚠️ At least 2 reviews are required to submit a decision.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckFeedbackPage;
