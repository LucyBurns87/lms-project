/**
 * Grade Submission Form Component
 * Allows teachers to grade student submissions
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubmission, gradeSubmission } from '../../api/submissions';
import LoadingSpinner from '../common/LoadingSpinner';
import './GradeSubmissionForm.css';

const GradeSubmissionForm = () => {
  const { id } = useParams(); // Submission ID from URL
  const navigate = useNavigate();
  
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    grade: '',
    feedback: '',
  });

  /**
   * Fetch submission details on mount
   */
  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const data = await getSubmission(id);
      setSubmission(data);
      
      // Pre-fill if already graded
      if (data.grade !== null) {
        setFormData({
          grade: data.grade,
          feedback: data.feedback || '',
        });
      }
    } catch (err) {
      setError('Failed to load submission');
      console.error('Error fetching submission:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate grade input
    if (name === 'grade') {
      const numValue = parseInt(value);
      if (value === '' || (numValue >= 0 && numValue <= 100)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.grade === '' || formData.grade < 0 || formData.grade > 100) {
      setError('Please enter a valid grade (0-100)');
      return;
    }

    try {
      setGrading(true);

      await gradeSubmission(
        id,
        parseInt(formData.grade),
        formData.feedback.trim()
      );
      
      // Success - redirect to submissions list
      alert('Submission graded successfully!');
      navigate('/submissions');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to grade submission');
      console.error('Error grading submission:', err);
    } finally {
      setGrading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading submission..." />;
  if (error && !submission) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="grade-form-container">
      <div className="grade-form-card">
        <h2>Grade Submission</h2>
        
        {/* Submission info */}
        <div className="submission-info">
          <div className="info-row">
            <span className="info-label">Student:</span>
            <span className="info-value">{submission.student_username}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Assignment:</span>
            <span className="info-value">{submission.assignment_title}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Submitted:</span>
            <span className="info-value">
              {new Date(submission.submitted_at).toLocaleString()}
            </span>
          </div>
          {submission.grade !== null && (
            <div className="info-row">
              <span className="info-label">Current Grade:</span>
              <span className="info-value grade">{submission.grade}%</span>
            </div>
          )}
        </div>

        {/* Submission content */}
        <div className="submission-content">
          <h3>Student's Work:</h3>
          <div className="content-box">
            {submission.content || submission.submission_text}
          </div>
          {submission.file && (
            <div className="file-attachment">
              <strong>Attached File:</strong>
              <a href={submission.file} target="_blank" rel="noopener noreferrer">
                View Attachment
              </a>
            </div>
          )}
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grade-form">
          {/* Grade input */}
          <div className="form-group">
            <label htmlFor="grade">Grade (0-100) *</label>
            <input
              type="number"
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              min="0"
              max="100"
              required
              disabled={grading}
              placeholder="Enter grade"
            />
            <small className="form-text">Enter a number between 0 and 100</small>
          </div>

          {/* Feedback textarea */}
          <div className="form-group">
            <label htmlFor="feedback">Feedback</label>
            <textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              placeholder="Provide constructive feedback to the student..."
              rows={6}
              disabled={grading}
            />
            <small className="form-text">
              Optional: Provide comments to help the student improve
            </small>
          </div>

          {/* Action buttons */}
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/submissions')} 
              className="btn btn-secondary"
              disabled={grading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={grading}
            >
              {grading ? 'Saving...' : 'Save Grade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeSubmissionForm;