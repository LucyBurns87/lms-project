/**
 * Assignments Page
 * Shows all assignments with create option for teachers
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AssignmentList from '../components/assignments/AssignmentList';

const Assignments = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Assignments</h1>
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <Link to="/assignments/create" className="btn btn-primary">
            Create New Assignment
          </Link>
        )}
      </div>
      <AssignmentList />
    </div>
  );
};

export default Assignments;