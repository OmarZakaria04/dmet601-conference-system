import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./ReviewFormPage.css";

const ReviewFormPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const reviewerEmail = location.state?.reviewerEmail || "reviewer1@conference.com";
  const [pdfPath, setPdfPath] = useState("");
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch reviewer by email to get assigned PDFs
    fetch(`/api/reviewers/by-email/${reviewerEmail}`)
      .then((res) => res.json())
      .then((reviewer) => {
        const paper = reviewer.PDF_IDs.find((pdf) => pdf.paperId === id);
        if (paper) {
          setPdfPath(paper.filePath);
        } else {
          setMessage("Paper not assigned to this reviewer.");
        }
      })
      .catch((err) => {
        console.error("Error fetching reviewer data:", err);
        setMessage("Error fetching reviewer data.");
      });
  }, [id]);

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!grade || !feedback) {
    setMessage("Please fill in both grade and feedback.");
    return;
  }

  fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      paperId: id,
      grade,
      feedback,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      setMessage(data.message || "Review submitted successfully!");
      setGrade("");
      setFeedback("");
    })
    .catch((err) => {
      console.error("❌ Submission error:", err);
      setMessage("Error submitting review.");
    });
};

  const handlePdfOpen = () => {
    if (!pdfPath) {
      setMessage("No PDF available for this paper.");
      return;
    }
    window.open(`http://localhost:5000${pdfPath}`, "_blank");
  };

  return (
    <div className="container">
      <h2 className="title">Review Paper</h2>

      <button className="openPdfButton" onClick={handlePdfOpen} disabled={!pdfPath}>
        Open PDF
      </button>

      {message && <p className="message success">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label>Grade (e.g., 1-10)</label>
          <input
            type="number"
            className="inputField"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            min={1}
            max={10}
          />
        </div>

        <div className="formGroup">
          <label>Feedback</label>
          <textarea
            className="textareaField"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write detailed feedback here..."
          />
        </div>

        <button type="submit" className="submitButton">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewFormPage;
