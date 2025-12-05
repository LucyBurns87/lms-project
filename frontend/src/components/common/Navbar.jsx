/**
 * Navigation bar component
 * Shows different options based on user role
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">LMS Platform</Link>
      </div>

      <div className="navbar-menu">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            
            {user?.role === 'student' && (
              <>
                <Link to="/courses">Browse Courses</Link>
                <Link to="/my-enrollments">My Courses</Link>
              </>
            )}

            {(user?.role === 'teacher' || user?.role === 'admin') && (
              <>
                <Link to="/courses">Manage Courses</Link>
                <Link to="/assignments">Assignments</Link>
                <Link to="/submissions">Submissions</Link>
              </>
            )}

            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Student Login</Link>
            <Link to="/teacher-login" className="btn-teacher-login">
              Teacher Login
            </Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;