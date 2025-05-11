import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SubmitPaperPage from "./pages/SubmitPaperPage";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import ReviewFormPage from "./pages/ReviewFormPage"; // import it here

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/submit" element={<SubmitPaperPage />} />
        <Route path="/reviewerdashboard" element={<ReviewerDashboard />} />
        <Route path="/review/:id" element={<ReviewFormPage />} /> {/* new route */}
      </Routes>
    </Router>
  );
}

export default App;
