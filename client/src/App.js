import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import ProtectedRoute from "./components/ProtectedRoute";
import NotAuthorizedPage from "./pages/NotAuthorizedPage";
import ConferenceSelector from './pages/ConferenceSelector'; // ✅ Make sure this is the correct path
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

 // Import the component




function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/not-authorized" element={<NotAuthorizedPage />} /> {/* Add this route */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} /> 

        {/* Author-only */}
        <Route
  path="/submit"
  element={
    <ProtectedRoute requiredRoles={["author"]}>
      <SubmitPaperPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/select-conference"
  element={
    <ProtectedRoute requiredRoles={["author"]}>
      <ConferenceSelector />
    </ProtectedRoute>
  }
/>

        {/* Reviewer-only */}
        <Route
          path="/reviewerdashboard"
          element={
            <ProtectedRoute requiredRoles={["reviewer"]}>
              <ReviewerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/:id"
          element={
            <ProtectedRoute requiredRoles={["reviewer"]}>
              <ReviewFormPage />
            </ProtectedRoute>
          }
        />

        {/* Chair-only */}
        <Route
          path="/chairdashboard"
          element={
            <ProtectedRoute requiredRoles={["chair"]}>
              <ChairDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignpdf"
          element={
            <ProtectedRoute requiredRoles={["chair"]}>
              <AssignPdfPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkfeedback"
          element={
            <ProtectedRoute requiredRoles={["chair"]}>
              <CheckFeedbackPage />
            </ProtectedRoute>
          }
        />

        {/* Admin-only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Generic user role */}
        <Route
          path="/user"
          element={
            <ProtectedRoute requiredRoles={["user"]}>
              <UserWaitingPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
