/**
 * Create Assignment Form Component
 * Allows teachers/admins to create new assignments
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAssignment } from '../../api/assignments';
import { getCourses } from '../../api/courses';
import './AssignmentForm.css';
import { useToast } from '../../context/ToastContext';

const AssignmentForm = () => {
  const { showSuccess, showError } = useToast();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAssignment(formData);
      showSuccess('Assignment created successfully!'); // Replace alert()
      navigate('/assignments');
    } catch (error) {
      showError('Failed to create assignment'); // Replace alert()
    }
  };


const CreateAssignmentForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    course: '',
    title: '',
    description: '',
    due_date: '',
  });

  /**
   * Fetch available courses on mount
   */
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

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

    // Validation
    if (!formData.course) {
      setError('Please select a course');
      return;
    }
    if (!formData.title.trim()) {
      setError('Please enter an assignment title');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for submission
      const assignmentData = {
        course: parseInt(formData.course),
        title: formData.title.trim(),
        description: formData.description.trim(),
        due_date: formData.due_date || null,
      };

      await createAssignment(assignmentData);
      
      // Success - redirect to assignments list
      navigate('/assignments');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create assignment');
      console.error('Error creating assignment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assignment-form-container">
      <div className="assignment-form-card">
        <h2>Create New Assignment</h2>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="assignment-form">
          {/* Course selection */}
          <div className="form-group">
            <label htmlFor="course">Course *</label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Assignment Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Week 1 Homework"
              required
              disabled={loading}
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide assignment instructions and requirements..."
              rows={6}
              disabled={loading}
            />
          </div>

          {/* Due date */}
          <div className="form-group">
            <label htmlFor="due_date">Due Date (Optional)</label>
            <input
              type="datetime-local"
              id="due_date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              disabled={loading}
            />
            <small className="form-text">Leave empty for no due date</small>
          </div>

          {/* Action buttons */}
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/assignments')} 
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
              {loading ? 'Creating...' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
};

export default CreateAssignmentForm;