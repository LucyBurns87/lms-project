import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/api';
import "./CourseList.css";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await apiClient.get('/courses/');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setMessage('Failed to load courses');
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId, courseTitle) => {
    try {
      await apiClient.post(`/courses/${courseId}/enroll/`);
      setMessage(`Successfully enrolled in ${courseTitle}!`);
    } catch (error) {
      console.error('Error enrolling:', error);
      setMessage(error.response?.data?.detail || "Error enrolling. Are you logged in as a student?");
    }
  };

  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="course-list">
      <h1>Available Courses</h1>
      {message && <p className="status-message">{message}</p>}
      <div className="courses-grid">
        {courses.length > 0 ? (
          courses.map(course => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="card-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleEnroll(course.id, course.title)}
                >
                  Enroll
                </button>
                <Link to={`/courses/${course.id}`}>
                  <button className="btn btn-secondary">View Details</button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No courses available at this time.</p>
        )}
      </div>
    </div>
  );
}

export default CourseList;