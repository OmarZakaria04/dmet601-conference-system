import React, { useState, useEffect } from "react";
import "./AssignPdfPage.css";
import Header from "../components/Header"; // ✅ Import Header

const AssignPdfPage = () => {
  const [reviewers, setReviewers] = useState([]);
  const [papers, setPapers] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [selectedPaper, setSelectedPaper] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
  // Fetch reviewers from backend
  fetch("/api/reviewers")
    .then((res) => res.json())
    .then((data) => {
      setReviewers(data);
    })
    .catch((err) => {
      console.error("Error fetching reviewers:", err);
    });

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
    console.log("⚠️ Reviewer or Paper not selected:", selectedReviewer, selectedPaper);
    return;
  }

  console.log("✅ Sending assignment request:", {
    reviewerEmail: selectedReviewer,
    paperId: selectedPaper,
  });

  fetch("/api/assignments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reviewerEmail: selectedReviewer,
      paperId: selectedPaper,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      setMessage(data.message || "Paper assigned successfully!");
    })
    .catch((err) => {
      setMessage("Error assigning paper.");
    });
};

  return (
    <div>
      <Header /> {/* ✅ Add header here */}
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
  {reviewers.map((rev) => (
    <option key={rev._id} value={rev.email}>
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
    </div>
  );
};

export default AssignPdfPage;