import React, { useState, useEffect } from "react";
import "./AssignPdfPage.css";

const AssignPdfPage = () => {
  const [reviewers, setReviewers] = useState([]);
  const [papers, setPapers] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [selectedPaper, setSelectedPaper] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Mock data for now — replace with API calls later
    setReviewers([
      { email: "reviewer1@example.com", name: "Reviewer One" },
      { email: "reviewer2@example.com", name: "Reviewer Two" },
    ]);

    setPapers([
      { id: "paper1", title: "AI in Healthcare" },
      { id: "paper2", title: "Blockchain for Data Security" },
    ]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedReviewer || !selectedPaper) {
      setMessage("Please select both a reviewer and a paper.");
      return;
    }

    // Send assignment to backend (e.g., POST reviewer + paperID)
    console.log({
      reviewer: selectedReviewer,
      paperId: selectedPaper,
    });

    setMessage("Paper assigned to reviewer successfully.");
  };

  return (
    <div className="assign-pdf-container">
      <h2>Assign Paper to Reviewer</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} className="assign-pdf-form">
        <div>
          <label>Select Reviewer</label>
          <select
            value={selectedReviewer}
            onChange={(e) => setSelectedReviewer(e.target.value)}
          >
            <option value="">-- Choose Reviewer --</option>
            {reviewers.map((rev, idx) => (
              <option key={idx} value={rev.email}>
                {rev.name} ({rev.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Select Paper</label>
          <select
            value={selectedPaper}
            onChange={(e) => setSelectedPaper(e.target.value)}
          >
            <option value="">-- Choose Paper --</option>
            {papers.map((paper, idx) => (
              <option key={idx} value={paper.id}>
                {paper.title} (ID: {paper.id})
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Assign</button>
      </form>
    </div>
  );
};

export default AssignPdfPage;
