import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = React.useContext(AuthContext);

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authenticated and authorized - render children
  return children;
};

export default ProtectedRoute;