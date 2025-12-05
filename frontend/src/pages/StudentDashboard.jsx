import React, { useEffect, useState } from "react";
import useAuth from '../hooks/useAuth';
import apiClient from '../api/axios';
import "./StudentDashboard.css";

function CourseCard({ course }) {
  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <button className="btn btn-primary">View Details</button>
    </div>
  );
}

function StudentDashboard() {
  const { user } = useAuth();
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

  const handleSubmitAssignment = async (assignmentId) => {
    try {
      const submission = prompt("Enter your solution/submission text:");
      if (!submission) return;

      await apiClient.post("/assignments/submissions/", {
        assignment: assignmentId,
        submission_text: submission
      });
      
      alert("Assignment submitted successfully!");
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Failed to submit assignment");
    }
  };

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
            {enrollments.map(e => (
              <CourseCard key={e.id} course={e.course} />
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
            {assignments.map(a => (
              <li key={a.id}>
                <strong>{a.title}</strong> — Due: {new Date(a.due_date).toLocaleDateString()}
                <button 
                  className="btn btn-primary"
                  onClick={() => handleSubmitAssignment(a.id)}
                >
                  Submit
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