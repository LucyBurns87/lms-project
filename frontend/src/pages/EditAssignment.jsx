/**
 * Edit Assignment Page
 * Teachers can edit existing assignments
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssignment, updateAssignment } from '../api/assignment';
import { getCourses } from '../api/courses';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './EditAssignment.css';

const EditAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
  const [assignment, setAssignment] = useState(null);
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
   * Fetch assignment and courses on mount
   */
  useEffect(() => {
    fetchData();
  }, [id]);

  /**
   * Fetch assignment and courses
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both assignment and courses
      const [assignmentData, coursesData] = await Promise.all([
        getAssignment(id),
        getCourses()
      ]);

      setAssignment(assignmentData);
      setCourses(coursesData);

      // Format due_date for datetime-local input
      const dueDate = assignmentData.due_date 
        ? new Date(assignmentData.due_date).toISOString().slice(0, 16)
        : '';

      // Populate form with assignment data
      setFormData({
        title: assignmentData.title,
        description: assignmentData.description,
        course: assignmentData.course,
        due_date: dueDate,
      });
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load assignment');
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
    }

    if (!formData.description.trim()) {
      errors.description = 'Assignment description is required';
    }

    if (!formData.course) {
      errors.course = 'Please select a course';
    }

    if (!formData.due_date) {
      errors.due_date = 'Due date is required';
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

      await updateAssignment(id, assignmentData);
      
      alert('✅ Assignment updated successfully!');
      navigate(`/assignments/${id}`);
    } catch (err) {
      console.error('Failed to update assignment:', err);
      setError(err.response?.data?.detail || 'Failed to update assignment');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return <LoadingSpinner message="Loading assignment..." />;
  }

  // Error state
  if (error && !assignment) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }

  return (
    <div className="edit-assignment-container">
      <div className="edit-assignment-card">
        <div className="form-header">
          <h2>✏️ Edit Assignment</h2>
          <button onClick={() => navigate(`/assignments/${id}`)} className="btn-secondary">
            Cancel
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit} className="assignment-form">
          {/* Same form fields as CreateAssignment */}
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
              className={validationErrors.title ? 'error' : ''}
              disabled={submitting}
            />
            {validationErrors.title && (
              <span className="error-message">{validationErrors.title}</span>
            )}
          </div>

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
              disabled={submitting}
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
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Assignment Instructions <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={8}
              className={validationErrors.description ? 'error' : ''}
              disabled={submitting}
            />
            {validationErrors.description && (
              <span className="error-message">{validationErrors.description}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(`/assignments/${id}`)}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAssignment;