/**
 * Unauthorized Access Page
 * Shown when user tries to access restricted content
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="error-icon">🚫</div>
        <h1>Access Denied</h1>
        <p>You don't have permission to view this page.</p>
        <div className="actions">
          <button onClick={() => navigate(-1)} className="btn-secondary">
            Go Back
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;