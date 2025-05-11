import React, { useState } from "react";
import axios from "axios";
import styles from "./SubmitPaperPage.module.css"; // Adjust the path

const SubmitPaperPage = () => {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState("");
  const [authors, setAuthors] = useState("");
  const [correspondingAuthor, setCorrespondingAuthor] = useState("");
  const [correspondingAuthorEmail, setCorrespondingAuthorEmail] = useState(""); // Added state for email
  const [category, setCategory] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title || !abstract || !keywords || !authors || !correspondingAuthor || !correspondingAuthorEmail || !category || !pdfFile) {
      setMessage("Please fill in all fields.");
      return;
    }

    // Extra validation: file size/type
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
    formData.append("correspondingAuthorEmail", correspondingAuthorEmail); // Added email
    formData.append("category", category);
    formData.append("pdf", pdfFile);

    try {
      setLoading(true);
      setMessage("");
      await axios.post("/api/papers/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("success: Paper submitted successfully!");
      // Clear form
      setTitle("");
      setAbstract("");
      setKeywords("");
      setAuthors("");
      setCorrespondingAuthor("");
      setCorrespondingAuthorEmail(""); // Clear email
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
    const color = type === "success" ? styles.success : styles.error;
    return <p className={`${styles.message} ${color}`}>{text.trim()}</p>;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Submit Your Paper</h2>
      {renderMessage()}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={styles.formGroup}>
          <label className="font-semibold">Paper Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label className="font-semibold">Abstract</label>
          <textarea
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            className={styles.textareaField}
            rows={4}
          />
        </div>
        <div className={styles.formGroup}>
          <label className="font-semibold">Keywords</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label className="font-semibold">Authors (names, affiliations, emails)</label>
          <textarea
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            className={styles.textareaField}
            rows={3}
          />
        </div>
        <div className={styles.formGroup}>
          <label className="font-semibold">Corresponding Author</label>
          <input
            type="text"
            value={correspondingAuthor}
            onChange={(e) => setCorrespondingAuthor(e.target.value)}
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label className="font-semibold">Corresponding Author Email</label>
          <input
            type="email"
            value={correspondingAuthorEmail}
            onChange={(e) => setCorrespondingAuthorEmail(e.target.value)}
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className="font-semibold">Submission Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.selectField}
          >
            <option value="">Select Category</option>
            <option value="AI">Artificial Intelligence</option>
            <option value="Networks">Computer Networks</option>
            <option value="Security">Cybersecurity</option>
            <option value="HCI">Human-Computer Interaction</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className="font-semibold">Upload PDF (4–8 pages)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            className={styles.inputField}
          />
          {pdfFile && <p className="text-sm text-gray-600 mt-1">Selected: {pdfFile.name}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Submitting..." : "Submit Paper"}
        </button>
      </form>
    </div>
  );
};

export default SubmitPaperPage;
