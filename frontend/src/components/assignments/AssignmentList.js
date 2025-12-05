/**
 * Assignment List Page
 * Displays all assignments with filtering options
 * Teachers can create new assignments
 * Students can view and submit assignments
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getAssignments } from '../../api/assignment';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import AssignmentCard from './AssignmentCard';
import './AssignmentList.css';

const AssignmentList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, completed

  /**
   * Fetch assignments on component mount
   */
  useEffect(() => {
    fetchAssignments();
  }, []);

  /**
   * Fetch all assignments from API
   */
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAssignments();
      setAssignments(data);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
      setError(err.response?.data?.detail || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter assignments based on selected filter
   */
  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !assignment.is_submitted;
    if (filter === 'completed') return assignment.is_submitted;
    return true;
  });

  /**
   * Navigate to create assignment page
   */
  const handleCreateAssignment = () => {
    navigate('/assignments/create');
  };

  // Show loading spinner
  if (loading) {
    return <LoadingSpinner message="Loading assignments..." />;
  }

  // Show error message
  if (error) {
    return <ErrorMessage message={error} onRetry={fetchAssignments} />;
  }

  return (
    <div className="assignment-list-container">
      {/* Header Section */}
      <div className="assignment-list-header">
        <h1>Assignments</h1>
        
        {/* Show Create button only for teachers */}
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <button 
            onClick={handleCreateAssignment}
            className="btn-primary"
          >
            + Create Assignment
          </button>
        )}
      </div>

      {/* Filter Section - Only for students */}
      {user?.role === 'student' && (
        <div className="assignment-filters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({assignments.length})
          </button>
          <button
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      )}

      {/* Assignment List */}
      {filteredAssignments.length === 0 ? (
        <div className="no-assignments">
          <p>No assignments found</p>
          {user?.role === 'teacher' && (
            <button onClick={handleCreateAssignment} className="btn-secondary">
              Create Your First Assignment
            </button>
          )}
        </div>
      ) : (
        <div className="assignment-grid">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onClick={() => navigate(`/assignments/${assignment.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentList;