import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import "./CheckFeedbackPage.css";

const CheckFeedbackPage = () => {
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [decision, setDecision] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Fetch all papers on mount
  useEffect(() => {
    fetch("/api/papers")
      .then((res) => res.json())
      .then((data) => setPapers(data))
      .catch((err) => console.error("Error fetching papers:", err));
  }, []);

  // ✅ When chair clicks "View Reviews"
  const handleViewReviews = (paper) => {
    setSelectedPaper(paper);
    fetch(`/api/reviews/by-paper/${paper._id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setReviews([]); // Clear reviews if error or none found
      });
  };

  const handleSubmit = () => {
    if (!selectedPaper || !decision) {
      setMessage("Please select a decision.");
      return;
    }

    console.log({
      paperId: selectedPaper._id,
      decision,
    });

    setMessage(`Decision "${decision}" recorded for paper "${selectedPaper.title}".`);
    setDecision("");
  };

  return (
    <div>
      <Header />
      <div className="check-feedback-container">
        <h2>Check Papers & Reviews</h2>
        {message && <p>{message}</p>}

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Paper Title</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {papers.map((paper) => (
              <tr key={paper._id}>
                <td className="border p-2">{paper.title}</td>
                <td className="border p-2">
                  <button onClick={() => handleViewReviews(paper)}>View Reviews</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedPaper && (
          <div className="feedback-table-section">
            <h3>Reviews for: {selectedPaper.title}</h3>
            {reviews.length === 0 ? (
              <p>No reviews found for this paper yet.</p>
            ) : (
              <table className="feedback-table">
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

            <div className="decision-buttons">
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

            <button onClick={handleSubmit}>Submit Decision</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckFeedbackPage;
