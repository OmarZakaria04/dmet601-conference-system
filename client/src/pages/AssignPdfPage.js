import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    fetch("/api/reviewers")
      .then((res) => res.json())
      .then((data) => setReviewers(data))
      .catch((err) => console.error("Error fetching reviewers:", err));

    fetchAssignablePapers();
  }, []);

  const fetchAssignablePapers = () => {
    fetch("/api/papers/assignable")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPapers(data);
        } else {
          setPapers([]); // Safe fallback if API returns message object
        }
      })
      .catch((err) => {
        console.error("Error fetching papers:", err);
        setPapers([]);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedReviewers = [selectedReviewer1, selectedReviewer2, selectedReviewer3]
      .filter((email, index, self) => email && self.indexOf(email) === index);

    if (!selectedPaper) {
      setMessage("Please select a paper.");
      return;
    }

    if (selectedReviewers.length < 2) {
      setMessage("Please select at least 2 different reviewers.");
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
        // Refresh papers list after assignment
        fetchAssignablePapers();
        // Clear selections
        setSelectedPaper("");
        setSelectedReviewer1("");
        setSelectedReviewer2("");
        setSelectedReviewer3("");
      })
      .catch((err) => {
        console.error("Error assigning paper:", err);
        setMessage("❌ Error assigning paper.");
      });
  };

  return (
    <div>
      <Header />
      <div className="assign-pdf-container">
        <h2>Assign Paper to Reviewers</h2>
        {message && <p>{message}</p>}

        <form onSubmit={handleSubmit} className="assign-pdf-form">
          <div>
            <label>Select Paper</label>
            <select
              value={selectedPaper}
              onChange={(e) => setSelectedPaper(e.target.value)}
              disabled={!papers.length}
            >
              <option value="">-- Choose Paper --</option>
              {papers.map((paper) => (
                <option key={paper._id} value={paper._id}>
                  {paper.title} ({paper.assignedReviewers?.length || 0} assigned)
                </option>
              ))}
            </select>
            {!papers.length && (
              <p style={{ color: "red" }}>All papers have at least 2 reviewers assigned.</p>
            )}
          </div>

          <div>
            <label>Select Reviewer 1</label>
            <select
              value={selectedReviewer1}
              onChange={(e) => setSelectedReviewer1(e.target.value)}
            >
              <option value="">-- Choose Reviewer 1 --</option>
              {reviewers.map((rev) => (
                <option key={rev._id} value={rev.email}>
                  {rev.name} ({rev.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Select Reviewer 2</label>
            <select
              value={selectedReviewer2}
              onChange={(e) => setSelectedReviewer2(e.target.value)}
            >
              <option value="">-- Choose Reviewer 2 --</option>
              {reviewers.map((rev) => (
                <option key={rev._id} value={rev.email}>
                  {rev.name} ({rev.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Select Reviewer 3 (optional)</label>
            <select
              value={selectedReviewer3}
              onChange={(e) => setSelectedReviewer3(e.target.value)}
            >
              <option value="">-- Choose Reviewer 3 --</option>
              {reviewers.map((rev) => (
                <option key={rev._id} value={rev.email}>
                  {rev.name} ({rev.email})
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={!papers.length}>Assign</button>
        </form>
      </div>
    </div>
  );
};

export default AssignPdfPage;
