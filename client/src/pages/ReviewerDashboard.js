import React, { useEffect, useState } from "react";
import "./ReviewerDashboard.css";

const ReviewerDashboard = () => {
  const [papers, setPapers] = useState([]);
  const reviewerEmail = "reviewer1@conference.com"; // ✅ Static reviewer email for now

  useEffect(() => {
    // Step 1: Fetch reviewer by email to get PDF_IDs
    fetch(`/api/reviewers/by-email/${reviewerEmail}`)
      .then((res) => res.json())
      .then(async (reviewer) => {
        if (!reviewer.PDF_IDs || reviewer.PDF_IDs.length === 0) {
          console.log("No papers assigned to this reviewer.");
          setPapers([]);
          return;
        }

        // Step 2: For each paperId in PDF_IDs, fetch details from AuthorSubmission
        const detailedPapers = await Promise.all(
          reviewer.PDF_IDs.map(async (pdf) => {
            try {
              const res = await fetch(`/api/papers/${pdf.paperId}`);
              const paper = await res.json();
              return { ...paper, filePath: pdf.filePath };
            } catch (err) {
              console.error("Failed to fetch paper details:", err);
              return null;
            }
          })
        );

        setPapers(detailedPapers.filter(p => p !== null));
      })
      .catch((err) => {
        console.error("Error fetching reviewer data:", err);
      });
  }, []);

  return (
    <div className="container">
      <h2 className="title">Reviewer Dashboard</h2>
      {papers.length === 0 ? (
        <p>No assigned papers found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Title</th>
              <th className="border p-2">Abstract</th>
              <th className="border p-2">Keywords</th>
              <th className="border p-2">Authors</th>
              <th className="border p-2">Corresponding Author</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">PDF</th>
            </tr>
          </thead>
          <tbody>
            {papers.map((paper, index) => (
              <tr key={index}>
                <td className="border p-2">{paper.title}</td>
                <td className="border p-2">{paper.abstract}</td>
                <td className="border p-2">{paper.keywords?.join(", ")}</td>
                <td className="border p-2">{paper.authors?.join(", ")}</td>
                <td className="border p-2">{paper.correspondingAuthor?.name}</td>
                <td className="border p-2">{paper.category}</td>
                <td className="border p-2">
                  <a href={paper.filePath} target="_blank" rel="noreferrer">
                    Open PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReviewerDashboard;
