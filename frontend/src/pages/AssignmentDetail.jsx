/**
 * Assignment Detail Page
 * Shows full assignment details
 * Students can submit assignments
 * Teachers can view submissions and edit assignment
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getAssignment, deleteAssignment } from '../api/assignment';
import { submitAssignment } from '../api/submissions';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SubmitAssignmentForm from '../components/submissions/SubmissionForm';
import './AssignmentDetail.css';

const AssignmentDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // State management
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Fetch assignment details on mount
   */
  useEffect(() => {
    fetchAssignment();
  }, [id]);

  /**
   * Fetch assignment from API
   */
  const fetchAssignment = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAssignment(id);
      setAssignment(data);
    } catch (err) {
      console.error('Failed to fetch assignment:', err);
      setError(err.response?.data?.detail || 'Failed to load assignment');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle assignment submission (student)
   */
  const handleSubmit = async (submissionData) => {
    try {
      setSubmitting(true);
      await submitAssignment(id, submissionData);
      alert('Assignment submitted successfully!');
      setShowSubmitForm(false);
      fetchAssignment(); // Refresh to show submitted status
    } catch (err) {
      console.error('Submission failed:', err);
      alert(err.response?.data?.detail || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle assignment deletion (teacher)
   */
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    try {
      await deleteAssignment(id);
      alert('Assignment deleted successfully');
      navigate('/assignments');
    } catch (err) {
      console.error('Delete failed:', err);
      alert(err.response?.data?.detail || 'Failed to delete assignment');
    }
  };

  /**
   * Format date to readable string
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Check if assignment is overdue
   */
  const isOverdue = () => {
    if (!assignment?.due_date) return false;
    return new Date(assignment.due_date) < new Date();
  };

  // Show loading state
  if (loading) {
    return <LoadingSpinner message="Loading assignment..." />;
  }

  // Show error state
  if (error) {
    return <ErrorMessage message={error} onRetry={fetchAssignment} />;
  }

  // No assignment found
  if (!assignment) {
    return <ErrorMessage message="Assignment not found" />;
  }

  return (
    <div className="assignment-detail-container">
      {/* Header */}
      <div className="assignment-detail-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Back
        </button>

        {/* Teacher Actions */}
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <div className="teacher-actions">
            <button 
              onClick={() => navigate(`/submissions?assignment=${id}`)}
              className="btn-secondary"
            >
              View Submissions
            </button>
            <button 
              onClick={() => navigate(`/assignments/${id}/edit`)}
              className="btn-primary"
            >
              Edit
            </button>
            <button onClick={handleDelete} className="btn-danger">
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Assignment Content */}
      <div className="assignment-content">
        {/* Title and Course */}
        <h1>{assignment.title}</h1>
        <p className="course-name">📚 {assignment.course_title}</p>

        {/* Due Date */}
        <div className={`due-date-section ${isOverdue() ? 'overdue' : ''}`}>
          <strong>Due Date:</strong> {formatDate(assignment.due_date)}
          {isOverdue() && !assignment.is_submitted && (
            <span className="overdue-badge">⚠️ Overdue</span>
          )}
        </div>

        {/* Description */}
        <div className="assignment-description">
          <h2>Description</h2>
          <p>{assignment.description || 'No description provided'}</p>
        </div>

        {/* Student View: Submission Status */}
        {user?.role === 'student' && (
          <div className="submission-section">
            {assignment.is_submitted ? (
              <div className="submitted-info">
                <h3>✅ Submitted</h3>
                <p>Submitted on: {formatDate(assignment.submitted_at)}</p>
                {assignment.grade !== null && (
                  <div className="grade-display">
                    <strong>Grade:</strong> {assignment.grade}/100
                  </div>
                )}
                {assignment.feedback && (
                  <div className="feedback-display">
                    <strong>Feedback:</strong>
                    <p>{assignment.feedback}</p>
                  </div>
                )}
                <button 
                  onClick={() => navigate(`/submissions/${assignment.submission_id}`)}
                  className="btn-secondary"
                >
                  View Submission
                </button>
              </div>
            ) : (
              <div className="not-submitted">
                <h3>📝 Not Submitted Yet</h3>
                {!showSubmitForm ? (
                  <button 
                    onClick={() => setShowSubmitForm(true)}
                    className="btn-primary"
                    disabled={isOverdue()}
                  >
                    {isOverdue() ? 'Submission Closed' : 'Submit Assignment'}
                  </button>
                ) : (
                  <SubmitAssignmentForm
                    onSubmit={handleSubmit}
                    onCancel={() => setShowSubmitForm(false)}
                    submitting={submitting}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentDetail;