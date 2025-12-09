import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import apiClient from '../api/axios';
import "./StudentDashboard.css";

function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [enrollmentResponse, assignmentResponse] = await Promise.all([
          apiClient.get("/courses/enrollments/my_enrollments/"),
          apiClient.get("/assignments/")
        ]);
        
        setEnrollments(enrollmentResponse.data);
        setAssignments(assignmentResponse.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
        setError("Failed to load your dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Loading your dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!user) return <p>Loading user data...</p>;

  return (
    <div className="student-dashboard">
      <h1>Welcome, {user.username}</h1>
      
      <section>
        <h2>My Enrolled Courses</h2>
        {enrollments.length > 0 ? (
          <div className="course-grid">
            {enrollments.map(enrollment => (
              <div key={enrollment.id} className="course-card">
                <h3>{enrollment.course.title}</h3>
                <p>{enrollment.course.description}</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate(`/courses/${enrollment.course.id}`)}
                >
                  View Course
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't enrolled in any courses yet.</p>
        )}
      </section>

      <section>
        <h2>My Assignments</h2>
        {assignments.length > 0 ? (
          <ul className="assignments-list">
            {assignments.map(assignment => (
              <li key={assignment.id}>
                <strong>{assignment.title}</strong> — Due: {new Date(assignment.due_date).toLocaleDateString()}
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate(`/assignments/${assignment.id}`)}
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No assignments available.</p>
        )}
      </section>
    </div>
  );
}

export default StudentDashboard;