import React, { useState } from "react";
import axios from "../services/api";

const SubmitPaperPage = () => {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !authors || !pdfFile) {
      setMessage("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("authors", authors);
    formData.append("pdf", pdfFile);

    try {
      const res = await axios.post("/api/papers/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Paper submitted successfully!");
      setTitle("");
      setAuthors("");
      setPdfFile(null);
    } catch (err) {
      setMessage("Error submitting paper.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Submit Your Paper</h2>
      {message && <p className="text-center text-sm text-red-600 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Paper Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter title"
          />
        </div>
        <div>
          <label className="block font-semibold">Authors</label>
          <input
            type="text"
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. Alice Smith, Bob Lee"
          />
        </div>
        <div>
          <label className="block font-semibold">Upload PDF</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Paper
        </button>
      </form>
    </div>
  );
};

export default SubmitPaperPage;
