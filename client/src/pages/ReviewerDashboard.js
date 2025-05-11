import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReviewerDashboard.css"; // Same folder



const ReviewerDashboard = () => {
  const [papers, setPapers] = useState([]);
  const navigate = useNavigate();

  // Dummy data for now – will be replaced with data from backend
  useEffect(() => {
    const dummyPapers = [
      {
        title: "AI in Healthcare",
        abstract: "Exploring applications of AI in modern medical diagnosis.",
        keywords: "AI, healthcare, machine learning",
        authors: "Alice Smith, Bob Lee",
        correspondingAuthor: "Alice Smith",
        category: "Artificial Intelligence",
        pdf: "/uploads/ai-healthcare.pdf",
      },
      {
        title: "Blockchain in Finance",
        abstract: "How blockchain is reshaping the financial sector.",
        keywords: "Blockchain, finance, cryptocurrency",
        authors: "John Doe, Jane Roe",
        correspondingAuthor: "John Doe",
        category: "FinTech",
        pdf: "/uploads/blockchain-finance.pdf",
      },
    ];

    setPapers(dummyPapers);
  }, []);

  return (
    <div className="container">
      <h2 className="title">Reviewer Dashboard</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th>
            <th className="border p-2">Abstract</th>
            <th className="border p-2">Keywords</th>
            <th className="border p-2">Authors</th>
            <th className="border p-2">Corresponding Author</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {papers.map((paper, index) => (
            <tr key={index}>
              <td className="border p-2">{paper.title}</td>
              <td className="border p-2">{paper.abstract}</td>
              <td className="border p-2">{paper.keywords}</td>
              <td className="border p-2">{paper.authors}</td>
              <td className="border p-2">{paper.correspondingAuthor}</td>
              <td className="border p-2">{paper.category}</td>
              <td className="border p-2">
                <button
                  className="submitButton"
                  onClick={() => navigate(`/review/${index}`)}
                >
                  Review Paper
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewerDashboard;
