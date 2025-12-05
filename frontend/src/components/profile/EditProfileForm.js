/**
 * Edit Profile Form Component
 * Allows users to update their profile information
 */
import React, { useState } from 'react';
import './EditProfileForm.css';

const EditProfileForm = ({ profileData, onSubmit, onCancel, submitting }) => {
  // Form state
  const [formData, setFormData] = useState({
    first_name: profileData?.first_name || '',
    last_name: profileData?.last_name || '',
    email: profileData?.email || '',
  });
  const [errors, setErrors] = useState({});

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Validate form
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.first_name && formData.first_name.length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    }

    if (formData.last_name && formData.last_name.length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="edit-profile-form">
      <h3>Edit Profile</h3>

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            disabled={submitting}
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        {/* First Name */}
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={errors.first_name ? 'error' : ''}
            disabled={submitting}
            placeholder="Enter your first name"
          />
          {errors.first_name && (
            <span className="error-message">{errors.first_name}</span>
          )}
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            id="last_name"
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={errors.last_name ? 'error' : ''}
            disabled={submitting}
            placeholder="Enter your last name"
          />
          {errors.last_name && (
            <span className="error-message">{errors.last_name}</span>
          )}
        </div>

        {/* Info Notice */}
        <div className="info-notice">
          <p>
            <strong>Note:</strong> Username and role cannot be changed.
            Contact an administrator if you need to modify these fields.
          </p>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;