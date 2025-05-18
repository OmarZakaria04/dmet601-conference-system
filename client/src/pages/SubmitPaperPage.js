import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./SubmitPaperPage.css";
import Header from "../components/Header";

const SubmitPaperPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const conference = location.state?.conference || null;

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState("");
  const [authors, setAuthors] = useState("");
  const [correspondingAuthor, setCorrespondingAuthor] = useState("");
  const [correspondingAuthorEmail, setCorrespondingAuthorEmail] = useState("");
  const [category, setCategory] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!conference) {
      alert("Please select a conference first.");
      navigate("/");
    }
  }, [conference, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!conference) {
      setMessage("No conference selected.");
      return;
    }

    if (
      !title ||
      !abstract ||
      !keywords ||
      !authors ||
      !correspondingAuthor ||
      !correspondingAuthorEmail ||
      !category ||
      !pdfFile
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!pdfFile.name.endsWith(".pdf")) {
      setMessage("Only PDF files are allowed.");
      return;
    }

    if (pdfFile.size > 10 * 1024 * 1024) {
      setMessage("PDF file must be less than 10MB.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("abstract", abstract);
    formData.append("keywords", keywords);
    formData.append("authors", authors);
    formData.append("correspondingAuthor", correspondingAuthor);
    formData.append("correspondingAuthorEmail", correspondingAuthorEmail);
    formData.append("category", category);
    formData.append("pdf", pdfFile);
    formData.append("conferenceId", conference._id);
    formData.append("conferenceName", conference.name);

    try {
      setLoading(true);
      setMessage("");
      await axios.post("http://localhost:5000/api/papers/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("success: Paper submitted successfully!");
      setTitle("");
      setAbstract("");
      setKeywords("");
      setAuthors("");
      setCorrespondingAuthor("");
      setCorrespondingAuthorEmail("");
      setCategory("");
      setPdfFile(null);
    } catch (err) {
      console.error(err);
      setMessage("error: Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = () => {
    if (!message) return null;
    const [type, text] = message.includes(":") ? message.split(":") : ["error", message];
    const colorClass = type === "success" ? "message-success" : "message-error";
    return <p className={`submit-message ${colorClass}`}>{text.trim()}</p>;
  };

  return (
    <div>
      <Header />
      <div className="submit-container">
        <div className="submit-card">
          <h2 className="submit-title">Submit Your Paper</h2>
          {conference && (
            <p className="selected-conference">
              <strong>Selected Conference:</strong> {conference.name}
            </p>
          )}
          {renderMessage()}
          <form onSubmit={handleSubmit} className="submit-form">
            <label>Paper Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

            <label>Abstract</label>
            <textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} rows={4} required />

            <label>Keywords</label>
            <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} required />

            <label>Authors (names, affiliations, emails)</label>
            <textarea value={authors} onChange={(e) => setAuthors(e.target.value)} rows={3} required />

            <label>Corresponding Author</label>
            <input type="text" value={correspondingAuthor} onChange={(e) => setCorrespondingAuthor(e.target.value)} required />

            <label>Corresponding Author Email</label>
            <input type="email" value={correspondingAuthorEmail} onChange={(e) => setCorrespondingAuthorEmail(e.target.value)} required />

            <label>Submission Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">Select Category</option>
              <option value="AI">Artificial Intelligence</option>
              <option value="Networks">Computer Networks</option>
              <option value="Security">Cybersecurity</option>
              <option value="HCI">Human-Computer Interaction</option>
            </select>

            <label>Upload PDF (4–8 pages)</label>
            <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} required />
            {pdfFile && <p className="file-preview">Selected: {pdfFile.name}</p>}

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? "Submitting..." : "Submit Paper"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitPaperPage;
