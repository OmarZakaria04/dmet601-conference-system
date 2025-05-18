import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // import this
import './ConferenceSelector.css';

const ConferenceSelector = () => {
  const [conferences, setConferences] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();  // hook for navigation

  useEffect(() => {
  axios.get('http://localhost:5000/api/conferences')  // ✅ corrected
    .then(res => setConferences(res.data))
    .catch(err => console.error(err));
}, []);


  const handleSelect = (conf) => {
    setSelected(conf);
    console.log("Selected conference:", conf);
  };

  const handleSubmit = () => {
    if (selected) {
      // navigate to /submit page, passing selected conference data in state
      navigate('/submit', { state: { conference: selected } });
    } else {
      alert('Please select a conference');
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString();

  const today = new Date();

  const getStatus = (conf) => {
    const deadlineDate = new Date(conf.deadline);
    const confDate = new Date(conf.date);

    if (today > deadlineDate) {
      return 'Deadline Reached';
    } else if (today < confDate) {
      return 'Starting Soon';
    } else {
      return 'In Progress';
    }
  };

  const isDeadlinePassed = (deadline) => {
    return today > new Date(deadline);
  };

  return (
    <div className="conference-container">
      <h2 className="conference-title">Select a Conference to Submit Your Paper</h2>
      <div>
        {conferences.map((conf) => {
          const disabled = isDeadlinePassed(conf.deadline)|| today < new Date(conf.date);;
          const status = getStatus(conf);

          return (
            <div
              key={conf._id}
              className={`conference-card ${selected?._id === conf._id ? 'selected' : ''}`}
            >
              <h3>{conf.name}</h3>
              <p><strong>Location:</strong> {conf.location}</p>
              <p><strong>Date:</strong> {formatDate(conf.date)}</p>
              <p><strong>Deadline:</strong> {formatDate(conf.deadline)}</p>

              <p><strong>Status:</strong> <span className={`status-${status.replace(' ', '-').toLowerCase()}`}>{status}</span></p>

              <p className="conference-description">{conf.description}</p>
              <button
                className="conference-select-btn"
                onClick={() => handleSelect(conf)}
                disabled={disabled}
                title={disabled ? "Submission deadline reached" : ""}
                style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}
              >
                Select
              </button>
            </div>
          );
        })}
      </div>
      <div className="submit-btn-container">
        <button className="submit-btn" onClick={handleSubmit}>
          Submit Paper
        </button>
      </div>
    </div>
  );
};

export default ConferenceSelector;
