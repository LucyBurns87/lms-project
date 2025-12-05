/**
 * Profile Card Component
 * Displays user profile information
 */
import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { getProfile, updateProfile } from '../../api/auth';
import LoadingSpinner from '../common/LoadingSpinner';
import './ProfileCard.css';

const ProfileCard = () => {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });

  /**
   * Initialize form with user data
   */
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setLoading(true);
      
      const updatedUser = await updateProfile(formData);
      
      // Update auth context with new data
      if (setUser) {
        setUser(updatedUser);
      }
      
      setSuccess(true);
      setEditing(false);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancel editing
   */
  const handleCancel = () => {
    setEditing(false);
    setError(null);
    // Reset form to current user data
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
      });
    }
  };

  /**
   * Get role badge color
   */
  const getRoleBadgeClass = () => {
    switch (user?.role) {
      case 'admin':
        return 'badge-admin';
      case 'teacher':
        return 'badge-teacher';
      case 'student':
        return 'badge-student';
      default:
        return 'badge-default';
    }
  };

  if (!user) return <LoadingSpinner message="Loading profile..." />;

  return (
    <div className="profile-card-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.first_name?.charAt(0) || user.username?.charAt(0) || 'U'}
          </div>
          <div className="profile-title">
            <h2>{user.username}</h2>
            <span className={`role-badge ${getRoleBadgeClass()}`}>
              {user.role?.toUpperCase()}
            </span>
          </div>
        </div>

        {success && (
          <div className="alert alert-success">
            Profile updated successfully!
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {!editing ? (
          // View mode
          <div className="profile-info">
            <div className="info-group">
              <label>Username</label>
              <p>{user.username}</p>
            </div>
            
            <div className="info-group">
              <label>Email</label>
              <p>{user.email || 'Not provided'}</p>
            </div>
            
            <div className="info-group">
              <label>First Name</label>
              <p>{user.first_name || 'Not provided'}</p>
            </div>
            
            <div className="info-group">
              <label>Last Name</label>
              <p>{user.last_name || 'Not provided'}</p>
            </div>
            
            <div className="info-group">
              <label>Role</label>
              <p>{user.role}</p>
            </div>

            <button 
              onClick={() => setEditing(true)} 
              className="btn btn-primary"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          // Edit mode
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={loading}
                maxLength={150}
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={loading}
                maxLength={150}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={handleCancel} 
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Additional stats card */}
      <div className="profile-stats">
        <h3>Account Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">
              {user.enrollments_count || 0}
            </div>
            <div className="stat-label">Courses</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {user.submissions_count || 0}
            </div>
            <div className="stat-label">Submissions</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {user.average_grade || 'N/A'}
            </div>
            <div className="stat-label">Avg Grade</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;