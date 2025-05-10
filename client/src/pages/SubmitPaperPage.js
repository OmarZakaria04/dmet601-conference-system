import React, { useState } from "react";
import axios from "axios"; // Make sure api.js exists in src/services

const SubmitPaperPage = () => {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState("");
  const [authors, setAuthors] = useState("");
  const [correspondingAuthor, setCorrespondingAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !abstract || !keywords || !authors || !correspondingAuthor || !category || !pdfFile) {
      setMessage("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("abstract", abstract);
    formData.append("keywords", keywords);
    formData.append("authors", authors);
    formData.append("correspondingAuthor", correspondingAuthor);
    formData.append("category", category);
    formData.append("pdf", pdfFile);

    try {
      await axios.post("/api/papers/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Paper submitted successfully!");
      // Clear form
      setTitle("");
      setAbstract("");
      setKeywords("");
      setAuthors("");
      setCorrespondingAuthor("");
      setCategory("");
      setPdfFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Submission failed.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Submit Your Paper</h2>
      {message && <p className="text-center text-red-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-semibold">Paper Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold">Abstract</label>
          <textarea
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        <div>
          <label className="font-semibold">Keywords</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold">Authors (names, affiliations, emails)</label>
          <textarea
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>
        <div>
          <label className="font-semibold">Corresponding Author</label>
          <input
            type="text"
            value={correspondingAuthor}
            onChange={(e) => setCorrespondingAuthor(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold">Submission Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Category</option>
            <option value="AI">Artificial Intelligence</option>
            <option value="Networks">Computer Networks</option>
            <option value="Security">Cybersecurity</option>
            <option value="HCI">Human-Computer Interaction</option>
          </select>
        </div>
        <div>
          <label className="font-semibold">Upload PDF (4–8 pages)</label>
          <input
            type="file"
            accept="application/pdf"
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