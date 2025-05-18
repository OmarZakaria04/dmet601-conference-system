import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AssignPdfPage.css";
import Header from "../components/Header";

const AssignPdfPage = () => {
  const [reviewers, setReviewers] = useState([]);
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState("");
  const [selectedReviewer1, setSelectedReviewer1] = useState("");
  const [selectedReviewer2, setSelectedReviewer2] = useState("");
  const [selectedReviewer3, setSelectedReviewer3] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // for Back button

  useEffect(() => {
    fetch("/api/reviewers")
      .then((res) => res.json())
      .then((data) => setReviewers(data))
      .catch((err) => console.error("Error fetching reviewers:", err));

    fetch("/api/papers")
      .then((res) => res.json())
      .then((data) => setPapers(data.map(p => ({ id: p._id, title: p.title }))))
      .catch((err) => console.error("Error fetching papers:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedReviewers = [selectedReviewer1, selectedReviewer2, selectedReviewer3]
      .filter((email, index, self) => email && self.indexOf(email) === index);

    if (!selectedPaper) {
      setMessage("❌ Please select a paper.");
      return;
    }

    if (selectedReviewers.length < 2) {
      setMessage("❌ Please select at least 2 different reviewers.");
      return;
    }

    Promise.all(
      selectedReviewers.map((reviewerEmail) =>
        fetch("/api/assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reviewerEmail,
            paperId: selectedPaper,
          }),
        }).then((res) => res.json())
      )
    )
      .then(() => {
        setMessage("✅ Paper assigned successfully to selected reviewers.");
      })
      .catch((err) => {
        console.error("Error assigning paper:", err);
        setMessage("❌ Error assigning paper.");
      });
  };

  return (
    <div className="assign-pdf-page">
      <Header />
      <div className="assign-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h2>Assign PDF to Reviewers</h2>
        {message && <p className="assign-message">{message}</p>}

        <form onSubmit={handleSubmit} className="assign-form">
          <div className="form-group">
            <label>Select Paper</label>
            <select value={selectedPaper} onChange={(e) => setSelectedPaper(e.target.value)}>
              <option value="">— Choose Paper —</option>
              {papers.map((paper) => (
                <option key={paper.id} value={paper.id}>
                  {paper.title} (ID: {paper.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Reviewer 1</label>
            <select value={selectedReviewer1} onChange={(e) => setSelectedReviewer1(e.target.value)}>
              <option value="">— Select Reviewer 1 —</option>
              {reviewers.map((rev) => (
                <option key={rev._id} value={rev.email}>
                  {rev.name} ({rev.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Reviewer 2</label>
            <select value={selectedReviewer2} onChange={(e) => setSelectedReviewer2(e.target.value)}>
              <option value="">— Select Reviewer 2 —</option>
              {reviewers.map((rev) => (
                <option key={rev._id} value={rev.email}>
                  {rev.name} ({rev.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Reviewer 3 (optional)</label>
            <select value={selectedReviewer3} onChange={(e) => setSelectedReviewer3(e.target.value)}>
              <option value="">— Select Reviewer 3 (optional) —</option>
              {reviewers.map((rev) => (
                <option key={rev._id} value={rev.email}>
                  {rev.name} ({rev.email})
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="assign-btn">Assign</button>
        </form>
      </div>
    </div>
  );
};

export default AssignPdfPage;
