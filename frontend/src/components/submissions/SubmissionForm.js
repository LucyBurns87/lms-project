/**
 * Submit Assignment Form Component
 * Allows students to submit their assignment work
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssignment } from '../../api/assignment';
import { submitAssignment } from '../../api/submissions';
import LoadingSpinner from '../common/LoadingSpinner';
import './SubmissionForm.css';

const SubmitAssignmentForm = () => {
  const { id } = useParams(); // Assignment ID from URL
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    content: '',
    file: null,
  });

  /**
   * Fetch assignment details on mount
   */
  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const data = await getAssignment(id);
      setAssignment(data);
    } catch (err) {
      setError('Failed to load assignment details');
      console.error('Error fetching assignment:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle text input change
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Handle file selection
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      file: file
    });
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.content.trim()) {
      setError('Please enter your submission content');
      return;
    }

    try {
      setSubmitting(true);

      const submissionData = {
        assignment: parseInt(id),
        content: formData.content.trim(),
        // Note: File upload may need FormData implementation
        // depending on your backend file handling
      };

      await submitAssignment(submissionData);
      
      // Success - redirect to assignment details
      alert('Assignment submitted successfully!');
      navigate(`/assignments/${id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit assignment');
      console.error('Error submitting assignment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading assignment..." />;
  if (error && !assignment) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="submission-form-container">
      <div className="submission-form-card">
        <h2>Submit Assignment</h2>
        
        {/* Assignment info */}
        <div className="assignment-info">
          <h3>{assignment.title}</h3>
          <p className="course-name">{assignment.course_title}</p>
          <div className="assignment-description">
            <h4>Instructions:</h4>
            <p>{assignment.description || 'No instructions provided'}</p>
          </div>
          {assignment.due_date && (
            <p className="due-date">
              Due: {new Date(assignment.due_date).toLocaleString()}
            </p>
          )}
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="submission-form">
          {/* Submission content */}
          <div className="form-group">
            <label htmlFor="content">Your Submission *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter your assignment work here..."
              rows={10}
              required
              disabled={submitting}
            />
            <small className="form-text">
              Provide your answer, code, or written response
            </small>
          </div>

          {/* File upload (optional) */}
          <div className="form-group">
            <label htmlFor="file">Attach File (Optional)</label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              disabled={submitting}
              accept=".pdf,.doc,.docx,.txt,.zip"
            />
            <small className="form-text">
              Supported formats: PDF, DOC, DOCX, TXT, ZIP (Max 10MB)
            </small>
          </div>

          {/* Action buttons */}
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
              {submitting ? 'Submitting...' : 'Submit Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitAssignmentForm;