/**
 * Submissions Page
 * Shows submissions for teachers to grade
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSubmissions } from '../api/submissions';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './Submissions.css';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getSubmissions();
      setSubmissions(data);
    } catch (err) {
      setError('Failed to load submissions');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading submissions..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchSubmissions} />;

  return (
    <div className="page-container">
      <h1>Student Submissions</h1>
      
      {submissions.length === 0 ? (
        <div className="empty-state">
          <p>No submissions yet</p>
        </div>
      ) : (
        <div className="submissions-list">
          {submissions.map(submission => (
            <div key={submission.id} className="submission-card">
              <div className="submission-info">
                <h3>{submission.assignment_title}</h3>
                <p>Student: {submission.student_username}</p>
                <p>Submitted: {new Date(submission.submitted_at).toLocaleString()}</p>
                {submission.grade !== null && (
                  <p className="grade">Grade: {submission.grade}%</p>
                )}
              </div>
              <div className="submission-actions">
                <Link 
                  to={`/submissions/${submission.id}/grade`} 
                  className="btn btn-primary"
                >
                  {submission.grade !== null ? 'Update Grade' : 'Grade Submission'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Submissions;