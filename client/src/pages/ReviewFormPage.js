import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./ReviewFormPage.css";

const ReviewFormPage = () => {
  const { id } = useParams(); // gets the paper ID from URL
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");

  // Dummy PDF URL (replace with actual logic later)
 const dummyPdfUrl = "/test.pdf";


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grade || !feedback) {
      setMessage("Please fill in both grade and feedback.");
      return;
    }

    // In a real app, send this to the backend
    console.log({
      paperId: id,
      grade,
      feedback,
    });

    setMessage("Review submitted successfully.");
    setGrade("");
    setFeedback("");
  };

  const handlePdfOpen = () => {
    window.open(dummyPdfUrl, "_blank");
  };

  return (
    <div className="container">
      <h2 className="title">Review Paper</h2>

      {/* Button to open the PDF */}
      <button className="openPdfButton" onClick={handlePdfOpen}>
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
