/**
 * Create Assignment Page
 * Teachers can create new assignments for their courses
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses } from '../api/courses';
import { createAssignment } from '../api/assignment';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './CreateAssignment.css';

const CreateAssignment = () => {
  const navigate = useNavigate();

  // State management
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    due_date: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  /**
   * Fetch teacher's courses on mount
   */
  useEffect(() => {
    fetchCourses();
  }, []);

  /**
   * Fetch courses that the teacher created
   */
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await getCourses();
      // Filter to show only courses created by current user (teacher)
      setCourses(data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Validate form
   */
  const validate = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Assignment title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Assignment description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    if (!formData.course) {
      errors.course = 'Please select a course';
    }

    if (!formData.due_date) {
      errors.due_date = 'Due date is required';
    } else {
      const dueDate = new Date(formData.due_date);
      const now = new Date();
      if (dueDate < now) {
        errors.due_date = 'Due date must be in the future';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const assignmentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        course: parseInt(formData.course),
        due_date: formData.due_date,
      };

      const createdAssignment = await createAssignment(assignmentData);
      
      alert('✅ Assignment created successfully!');
      navigate(`/assignments/${createdAssignment.id}`);
    } catch (err) {
      console.error('Failed to create assignment:', err);
      setError(err.response?.data?.detail || 'Failed to create assignment');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return <LoadingSpinner message="Loading courses..." />;
  }

  return (
    <div className="create-assignment-container">
      <div className="create-assignment-card">
        <div className="form-header">
          <h2>📝 Create New Assignment</h2>
          <button onClick={() => navigate('/assignments')} className="btn-secondary">
            Cancel
          </button>
        </div>

        {/* Error alert */}
        {error && (
          <div className="alert alert-danger">
            ⚠️ {error}
          </div>
        )}

        {/* No courses warning */}
        {courses.length === 0 && (
          <div className="alert alert-warning">
            ⚠️ You need to create a course first before creating assignments.
            <button onClick={() => navigate('/courses/create')} className="btn-link">
              Create Course
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="assignment-form">
          {/* Assignment Title */}
          <div className="form-group">
            <label htmlFor="title">
              Assignment Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., JavaScript Arrays Assignment"
              className={validationErrors.title ? 'error' : ''}
              disabled={submitting}
            />
            {validationErrors.title && (
              <span className="error-message">{validationErrors.title}</span>
            )}
          </div>

          {/* Course Selection */}
          <div className="form-group">
            <label htmlFor="course">
              Course <span className="required">*</span>
            </label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className={validationErrors.course ? 'error' : ''}
              disabled={submitting || courses.length === 0}
            >
              <option value="">Select a course...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            {validationErrors.course && (
              <span className="error-message">{validationErrors.course}</span>
            )}
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label htmlFor="due_date">
              Due Date <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              id="due_date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className={validationErrors.due_date ? 'error' : ''}
              disabled={submitting}
            />
            {validationErrors.due_date && (
              <span className="error-message">{validationErrors.due_date}</span>
            )}
            <small className="form-text">
              Set when students must submit this assignment
            </small>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">
              Assignment Instructions <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed instructions for students..."
              rows={8}
              className={validationErrors.description ? 'error' : ''}
              disabled={submitting}
            />
            {validationErrors.description && (
              <span className="error-message">{validationErrors.description}</span>
            )}
            <small className="form-text">
              Include requirements, submission format, grading criteria, etc.
            </small>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/assignments')}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || courses.length === 0}
            >
              {submitting ? 'Creating...' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignment;