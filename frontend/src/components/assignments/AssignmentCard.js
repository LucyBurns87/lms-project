/**
 * Assignment Card Component
 * Displays assignment summary with status indicators
 */
import React from 'react';
import useAuth from '../../hooks/useAuth';
import './AssignmentCard.css';

const AssignmentCard = ({ assignment, onClick }) => {
  const { user } = useAuth();

  /**
   * Format date to readable string
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Check if assignment is overdue
   */
  const isOverdue = () => {
    if (!assignment.due_date) return false;
    return new Date(assignment.due_date) < new Date() && !assignment.is_submitted;
  };

  /**
   * Get status badge based on assignment state
   */
  const getStatusBadge = () => {
    if (user?.role === 'student') {
      if (assignment.is_submitted) {
        return <span className="badge badge-success">Submitted</span>;
      }
      if (isOverdue()) {
        return <span className="badge badge-danger">Overdue</span>;
      }
      return <span className="badge badge-warning">Pending</span>;
    }
    return null;
  };

  return (
    <div className="assignment-card" onClick={onClick}>
      {/* Status Badge */}
      <div className="assignment-card-header">
        {getStatusBadge()}
      </div>

      {/* Assignment Title */}
      <h3 className="assignment-title">{assignment.title}</h3>

      {/* Course Name */}
      <p className="assignment-course">
        📚 {assignment.course_title}
      </p>

      {/* Description Preview */}
      <p className="assignment-description">
        {assignment.description?.substring(0, 100)}
        {assignment.description?.length > 100 && '...'}
      </p>

      {/* Due Date */}
      <div className="assignment-footer">
        <span className={`due-date ${isOverdue() ? 'overdue' : ''}`}>
          🕒 Due: {formatDate(assignment.due_date)}
        </span>
      </div>

      {/* Teacher View: Show submission count */}
      {(user?.role === 'teacher' || user?.role === 'admin') && (
        <div className="assignment-stats">
          <span>📝 {assignment.submission_count || 0} submissions</span>
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;