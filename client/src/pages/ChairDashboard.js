import { Link } from "react-router-dom";
import "./ChairDashboard.css"; // Add your custom styles here

const ChairDashboard = () => {
  return (
    <div className="chair-dashboard">
      <h2>Chair Dashboard</h2>
      
      <div className="button-container">
        {/* Button for assigning PDFs to reviewers */}
        <Link to="/assignpdf">
          <button className="chair-button">Assign PDF to Reviewers</button>
        </Link>

        {/* Button for checking reviewers' feedback */}
        <Link to="/checkfeedback">
          <button className="chair-button">Check Reviewers' Feedback</button>
        </Link>
      </div>
    </div>
  );
};

export default ChairDashboard;
