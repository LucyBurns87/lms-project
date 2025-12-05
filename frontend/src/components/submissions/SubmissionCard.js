/**
 * Submission Card Component
 * Displays submission summary with grading status
 */
import React from 'react';
import './SubmissionCard.css';

const SubmissionCard = ({ submission, onClick }) => {
  /**
   * Format date to readable string
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get grade badge color
   */
  const getGradeBadgeClass = (grade) => {
    if (grade >= 90) return 'grade-excellent';
    if (grade >= 80) return 'grade-good';
    if (grade >= 70) return 'grade-average';
    if (grade >= 60) return 'grade-passing';
    return 'grade-failing';
  };

  return (
    <div className="submission-card" onClick={onClick}>
      {/* Student Info */}
      <div className="submission-header">
        <div className="student-info">
          <span className="student-icon">👤</span>
          <span className="student-name">{submission.student_username}</span>
        </div>
        
        {/* Grade Badge */}
        {submission.grade !== null ? (
          <div className={`grade-badge ${getGradeBadgeClass(submission.grade)}`}>
            {submission.grade}/100
          </div>
        ) : (
          <div className="grade-badge pending">
            Pending
          </div>
        )}
      </div>

      {/* Submission Preview */}
      <div className="submission-content">
        <p className="content-preview">
          {submission.content?.substring(0, 100)}
          {submission.content?.length > 100 && '...'}
        </p>
      </div>

      {/* Submission Info */}
      <div className="submission-footer">
        <span className="submission-date">
          🕒 {formatDate(submission.submitted_at)}
        </span>
        {submission.file && (
          <span className="has-attachment">📎 Attachment</span>
        )}
      </div>

      {/* Feedback Preview */}
      {submission.feedback && (
        <div className="feedback-preview">
          <strong>Feedback:</strong> {submission.feedback.substring(0, 50)}...
        </div>
      )}
    </div>
  );
};

export default SubmissionCard;