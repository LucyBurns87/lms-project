/**
 * 404 Not Found Page
 * Shown for invalid routes
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="error-code">404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <div className="actions">
          <button onClick={() => navigate(-1)} className="btn-secondary">
            Go Back
          </button>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;