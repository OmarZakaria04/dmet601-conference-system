import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SubmitPaperPage from "./pages/SubmitPaperPage";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import ReviewFormPage from "./pages/ReviewFormPage";
import ChairDashboard from "./pages/ChairDashboard";
import AssignPdfPage from "./pages/AssignPdfPage";
import CheckFeedbackPage from "./pages/CheckFeedbackPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserWaitingPage from "./pages/UserWaitingPage";
import AdminPage from "./pages/AdminPage";

// ProtectedRoute component to restrict access to logged-in users only
const ProtectedRoute = ({ children }) => {
  const userEmail = localStorage.getItem("userEmail");
  if (!userEmail) {
    // Redirect to login page if not authenticated
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/submit"
          element={
            <ProtectedRoute>
              <SubmitPaperPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewerdashboard"
          element={
            <ProtectedRoute>
              <ReviewerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/:id"
          element={
            <ProtectedRoute>
              <ReviewFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chairdashboard"
          element={
            <ProtectedRoute>
              <ChairDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignpdf"
          element={
            <ProtectedRoute>
              <AssignPdfPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkfeedback"
          element={
            <ProtectedRoute>
              <CheckFeedbackPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserWaitingPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
