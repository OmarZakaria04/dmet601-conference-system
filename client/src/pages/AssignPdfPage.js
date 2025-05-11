import React, { useState, useEffect } from "react";
import "./AssignPdfPage.css";

const AssignPdfPage = () => {
  const [reviewers, setReviewers] = useState([]);
  const [papers, setPapers] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [selectedPaper, setSelectedPaper] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
  // Fetch reviewers (static for now)
  setReviewers([
    { email: "reviewer1@example.com", name: "Reviewer One" },
    { email: "reviewer2@example.com", name: "Reviewer Two" },
  ]);

  // Fetch papers from backend
  fetch("/api/papers")
    .then((res) => res.json())
    .then((data) => {
      setPapers(data.map(p => ({ id: p._id, title: p.title })));
    })
    .catch((err) => {
      console.error("Error fetching papers:", err);
    });
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