/**
 * My Enrollments Page
 * Students view all their enrolled courses
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyEnrollments } from '../../api/enrollments';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import './MyEnrollments.css';

const MyEnrollments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const data = await getMyEnrollments();
      setEnrollments(data);
    } catch (err) {
      setError('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your courses..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchEnrollments} />;
  if (!user) return <LoadingSpinner message="Loading user data..." />;

  return (
    <div className="my-enrollments-container">
      <h1>My Enrolled Courses</h1>
      
      {enrollments.length === 0 ? (
        <div className="no-enrollments">
          <p>You haven't enrolled in any courses yet.</p>
          <button onClick={() => navigate('/courses')} className="btn-primary">
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="enrollments-grid">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="course-card">
              <h3>{enrollment.course.title}</h3>
              <p>{enrollment.course.description}</p>
              <p className="enrollment-date">
                Enrolled: {new Date(enrollment.date_enrolled).toLocaleDateString()}
              </p>
              <button 
                onClick={() => navigate(`/courses/${enrollment.course.id}`)}
                className="btn btn-primary"
              >
                View Course
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEnrollments;