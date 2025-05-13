import React, { useState, useEffect } from "react";
import "./CheckFeedbackPage.css";
import Header from "../components/Header"; // ✅ Import Header


const CheckFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [decision, setDecision] = useState("");
  const [message, setMessage] = useState("");

  // Mocked data — Replace with actual API call for reviewer feedback
  useEffect(() => {
    const mockFeedbacks = [
      { 
        paperId: 1, 
        reviewer: "John Doe", 
        feedback: "Great paper, well-researched!", 
        grade: "A", 
        authorEmail: "author1@example.com"
      },
      { 
        paperId: 2, 
        reviewer: "Jane Smith", 
        feedback: "Needs more data and analysis.", 
        grade: "B", 
        authorEmail: "author2@example.com"
      },
    ];
    setFeedbacks(mockFeedbacks);
  }, []);

  const handleSubmit = () => {
    if (!selectedFeedback || !decision) {
      setMessage("Please select feedback and make a decision.");
      return;
    }

    // Simulate submitting decision to backend
    console.log({
      paperId: selectedFeedback.paperId,
      decision,
      authorEmail: selectedFeedback.authorEmail,
    });

    setMessage(`Decision "${decision}" recorded for paper "${selectedFeedback.paperId}".`);
    setDecision("");
  };

  return (
    <div>
    <Header /> {/* ✅ Add header here */}
    <div className="check-feedback-container">
      <h2>Reviewers' Feedback</h2>
      {message && <p>{message}</p>}

      <div>
        <label>Select a Paper</label>
        <select
          value={selectedFeedback?.paperId || ""}
          onChange={(e) =>
            setSelectedFeedback(feedbacks.find((feedback) => feedback.paperId === parseInt(e.target.value)))
          }
        >
          <option value="">-- Choose Paper --</option>
          {feedbacks.map((feedback) => (
            <option key={feedback.paperId} value={feedback.paperId}>
              {feedback.reviewer} - Paper ID: {feedback.paperId}
            </option>
          ))}
        </select>
      </div>

      {selectedFeedback && (
        <div className="feedback-table-section">
          <h3>Feedback Details:</h3>
          <table className="feedback-table">
            <thead>
              <tr>
                <th>Reviewer</th>
                <th>Feedback</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedFeedback.reviewer}</td>
                <td>{selectedFeedback.feedback}</td>
                <td>{selectedFeedback.grade}</td>
              </tr>
            </tbody>
          </table>

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
