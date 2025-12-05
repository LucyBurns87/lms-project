/**
 * Submission List Page
 * Teachers view all submissions for their courses
 * Allows filtering by course, assignment, and grading status
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getSubmissions } from '../api/submissions';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SubmissionCard from '../components/submissions/SubmissionCard';
import './SubmissionList.css';

const SubmissionList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State management
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, graded, pending

  // Get assignment ID from URL params if present
  const assignmentId = searchParams.get('assignment');

  /**
   * Fetch submissions on component mount
   */
  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  /**
   * Fetch submissions from API
   */
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSubmissions(assignmentId);
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
      setError(err.response?.data?.detail || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter submissions based on selected filter
   */
  const filteredSubmissions = submissions.filter((submission) => {
    if (filter === 'all') return true;
    if (filter === 'graded') return submission.grade !== null;
    if (filter === 'pending') return submission.grade === null;
    return true;
  });

  /**
   * Group submissions by assignment
   */
  const groupedSubmissions = filteredSubmissions.reduce((acc, submission) => {
    const assignmentTitle = submission.assignment_title;
    if (!acc[assignmentTitle]) {
      acc[assignmentTitle] = [];
    }
    acc[assignmentTitle].push(submission);
    return acc;
  }, {});

  // Show loading state
  if (loading) {
    return <LoadingSpinner message="Loading submissions..." />;
  }

  // Show error state
  if (error) {
    return <ErrorMessage message={error} onRetry={fetchSubmissions} />;
  }

  return (
    <div className="submission-list-container">
      {/* Header */}
      <div className="submission-list-header">
        <h1>
          {assignmentId ? 'Assignment Submissions' : 'All Submissions'}
        </h1>
        {assignmentId && (
          <button onClick={() => navigate('/submissions')} className="btn-secondary">
            View All Submissions
          </button>
        )}
      </div>

      {/* Statistics */}
      <div className="submission-stats">
        <div className="stat-card">
          <h3>{submissions.length}</h3>
          <p>Total Submissions</p>
        </div>
        <div className="stat-card">
          <h3>{submissions.filter(s => s.grade !== null).length}</h3>
          <p>Graded</p>
        </div>
        <div className="stat-card">
          <h3>{submissions.filter(s => s.grade === null).length}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>
            {submissions.length > 0
              ? (
                  submissions.filter(s => s.grade !== null).reduce((sum, s) => sum + s.grade, 0) /
                  submissions.filter(s => s.grade !== null).length
                ).toFixed(1)
              : 'N/A'}
          </h3>
          <p>Average Grade</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="submission-filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({submissions.length})
        </button>
        <button
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending ({submissions.filter(s => s.grade === null).length})
        </button>
        <button
          className={filter === 'graded' ? 'active' : ''}
          onClick={() => setFilter('graded')}
        >
          Graded ({submissions.filter(s => s.grade !== null).length})
        </button>
      </div>

      {/* Submission List */}
      {filteredSubmissions.length === 0 ? (
        <div className="no-submissions">
          <p>No submissions found</p>
        </div>
      ) : (
        <div className="submissions-grouped">
          {Object.entries(groupedSubmissions).map(([assignmentTitle, subs]) => (
            <div key={assignmentTitle} className="assignment-group">
              <h2 className="assignment-group-title">
                📝 {assignmentTitle}
                <span className="submission-count">({subs.length})</span>
              </h2>
              <div className="submission-grid">
                {subs.map((submission) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    onClick={() => navigate(`/submissions/${submission.id}`)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionList;