/**
 * Profile Page
 * Users can view and edit their profile information
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getProfile, updateProfile } from '../api/auth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EditProfileForm from '../components/profile/EditProfileForm';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();

  // State management
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  /**
   * Fetch profile data on mount
   */
  useEffect(() => {
    fetchProfile();
  }, []);

  /**
   * Fetch user profile from API
   */
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfile();
      setProfileData(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError(err.response?.data?.detail || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle profile update
   */
  const handleUpdate = async (updatedData) => {
    try {
      setUpdating(true);
      const data = await updateProfile(updatedData);
      setProfileData(data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
      alert(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Get role badge styling
   */
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'role-admin';
      case 'teacher':
        return 'role-teacher';
      case 'student':
        return 'role-student';
      default:
        return '';
    }
  };

  /**
   * Format date joined
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Show loading state
  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  // Show error state
  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProfile} />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn-primary">
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <EditProfileForm
          profileData={profileData}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          submitting={updating}
        />
      ) : (
        <div className="profile-content">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar">
              <span className="avatar-icon">
                {profileData?.first_name?.[0] || profileData?.username?.[0] || '?'}
              </span>
            </div>

            <div className="profile-info">
              <h2>
                {profileData?.first_name && profileData?.last_name
                  ? `${profileData.first_name} ${profileData.last_name}`
                  : profileData?.username}
              </h2>
              <span className={`role-badge ${getRoleBadgeClass(profileData?.role)}`}>
                {profileData?.role?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="profile-details">
            <div className="detail-group">
              <h3>Account Information</h3>
              
              <div className="detail-item">
                <label>Username</label>
                <span>{profileData?.username}</span>
              </div>

              <div className="detail-item">
                <label>Email</label>
                <span>{profileData?.email || 'Not provided'}</span>
              </div>

              <div className="detail-item">
                <label>First Name</label>
                <span>{profileData?.first_name || 'Not provided'}</span>
              </div>

              <div className="detail-item">
                <label>Last Name</label>
                <span>{profileData?.last_name || 'Not provided'}</span>
              </div>

              <div className="detail-item">
                <label>Role</label>
                <span className="capitalize">{profileData?.role}</span>
              </div>

              {profileData?.date_joined && (
                <div className="detail-item">
                  <label>Member Since</label>
                  <span>{formatDate(profileData.date_joined)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Account Actions */}
          <div className="account-actions">
            <button onClick={logout} className="btn-danger">
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;