/**
 * Submission Detail Page
 * Students can view their submission and grade
 * Teachers can grade and provide feedback
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getSubmission, gradeSubmission } from '../api/submissions';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import GradeSubmissionForm from '../components/submissions/GradeSubmissionForm';
import './SubmissionDetail.css';

const SubmissionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // State management
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [grading, setGrading] = useState(false);

  /**
   * Fetch submission on mount
   */
  useEffect(() => {
    fetchSubmission();
  }, [id]);

  /**
   * Fetch submission from API
   */
  const fetchSubmission = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSubmission(id);
      setSubmission(data);
    } catch (err) {
      console.error('Failed to fetch submission:', err);
      setError(err.response?.data?.detail || 'Failed to load submission');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle grading submission (teacher)
   */
  const handleGrade = async (gradeData) => {
    try {
      setGrading(true);
      await gradeSubmission(id, gradeData.grade, gradeData.feedback);
      alert('Submission graded successfully!');
      setShowGradeForm(false);
      fetchSubmission(); // Refresh to show updated grade
    } catch (err) {
      console.error('Grading failed:', err);
      alert(err.response?.data?.detail || 'Failed to grade submission');
    } finally {
      setGrading(false);
    }
  };

  /**
   * Format date to readable string
   */
  const formatDate = (dateString) => {
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
   * Get grade color class
   */
  const getGradeClass = (grade) => {
    if (grade >= 90) return 'excellent';
    if (grade >= 80) return 'good';
    if (grade >= 70) return 'average';
    if (grade >= 60) return 'passing';
    return 'failing';
  };

  // Show loading state
  if (loading) {
    return <LoadingSpinner message="Loading submission..." />;
  }

  // Show error state
  if (error) {
    return <ErrorMessage message={error} onRetry={fetchSubmission} />;
  }

  // No submission found
  if (!submission) {
    return <ErrorMessage message="Submission not found" />;
  }

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
  const isStudent = user?.role === 'student';
  const isGraded = submission.grade !== null;

  return (
    <div className="submission-detail-container">
      {/* Header */}
      <div className="submission-detail-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Back
        </button>

        {/* Teacher Actions */}
        {isTeacher && !showGradeForm && (
          <button
            onClick={() => setShowGradeForm(true)}
            className="btn-primary"
          >
            {isGraded ? 'Edit Grade' : 'Grade Submission'}
          </button>
        )}
      </div>

      {/* Submission Info Card */}
      <div className="submission-info-card">
        <h1>{submission.assignment_title}</h1>
        
        <div className="info-grid">
          <div className="info-item">
            <strong>Student:</strong>
            <span>{submission.student_username}</span>
          </div>
          <div className="info-item">
            <strong>Submitted:</strong>
            <span>{formatDate(submission.submitted_at)}</span>
          </div>
          <div className="info-item">
            <strong>Status:</strong>
            <span className={`status ${isGraded ? 'graded' : 'pending'}`}>
              {isGraded ? '✅ Graded' : '⏳ Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Grade Display */}
      {isGraded && (
        <div className={`grade-display ${getGradeClass(submission.grade)}`}>
          <h2>Grade</h2>
          <div className="grade-score">
            {submission.grade}/100
          </div>
          {submission.feedback && (
            <div className="feedback-section">
              <h3>Teacher's Feedback</h3>
              <p>{submission.feedback}</p>
            </div>
          )}
        </div>
      )}

      {/* Grade Form (Teacher View) */}
      {isTeacher && showGradeForm && (
        <GradeSubmissionForm
          currentGrade={submission.grade}
          currentFeedback={submission.feedback}
          onSubmit={handleGrade}
          onCancel={() => setShowGradeForm(false)}
          submitting={grading}
        />
      )}

      {/* Submission Content */}
      <div className="submission-content-section">
        <h2>Submission Content</h2>
        <div className="submission-text">
          {submission.content || 'No content provided'}
        </div>

        {/* Attached File */}
        {submission.file && (
          <div className="attachment-section">
            <h3>📎 Attached File</h3>
            <a
              href={submission.file}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-download"
            >
              📥 Download Attachment
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionDetail;