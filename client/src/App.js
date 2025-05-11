import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SubmitPaperPage from "./pages/SubmitPaperPage";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import ReviewFormPage from "./pages/ReviewFormPage"; // Review form for specific paper
import ChairDashboard from "./pages/ChairDashboard"; // Import ChairDashboard
import AssignPdfPage from "./pages/AssignPdfPage"; // Page for assigning PDFs to reviewers
import CheckFeedbackPage from "./pages/CheckFeedbackPage"; // Page to check reviewers' feedback

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for submitting a paper */}
        <Route path="/submit" element={<SubmitPaperPage />} />

        {/* Route for the reviewer dashboard */}
        <Route path="/reviewerdashboard" element={<ReviewerDashboard />} />

        {/* Route for reviewing a paper, dynamically accepting an 'id' */}
        <Route path="/review/:id" element={<ReviewFormPage />} />

        {/* Route for Chair Dashboard */}
        <Route path="/chairdashboard" element={<ChairDashboard />} />

        {/* Route for assigning PDFs to reviewers */}
        <Route path="/assignpdf" element={<AssignPdfPage />} />

        {/* Route for checking feedback from reviewers */}
        <Route path="/checkfeedback" element={<CheckFeedbackPage />} />
      </Routes>
    </Router>
  );
}

export default App;
