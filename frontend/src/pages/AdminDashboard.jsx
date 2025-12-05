import React, { useEffect, useState } from "react";
import apiClient from "../api/api";
import "./AdminDashboard.css";

function AdminDashboard({ user }) {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [courseResponse, enrollmentResponse, userResponse, submissionResponse] = await Promise.all([
          apiClient.get("/courses/"),
          apiClient.get("/enrollments/"),
          apiClient.get("/users/"),
          apiClient.get("/assignments/submissions/")
        ]);

        setCourses(courseResponse.data);
        setEnrollments(enrollmentResponse.data);
        setUsers(userResponse.data);
        setSubmissions(submissionResponse.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setError("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Loading admin dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <h2>Welcome, {user.username}</h2>

      <section>
        <h3>All Courses ({courses.length})</h3>
        {courses.length > 0 ? (
          <ul>
            {courses.map(course => (
              <li key={course.id}>
                <strong>{course.title}</strong> — {course.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>No courses available.</p>
        )}
      </section>

      <section>
        <h3>All Enrollments ({enrollments.length})</h3>
        {enrollments.length > 0 ? (
          <ul>
            {enrollments.map(e => (
              <li key={e.id}>
                Student: {e.student} | Course: {e.course?.title || 'N/A'} | 
                Date: {new Date(e.date_enrolled).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No enrollments yet.</p>
        )}
      </section>

      <section>
        <h3>All Users ({users.length})</h3>
        {users.length > 0 ? (
          <ul>
            {users.map(u => (
              <li key={u.id}>
                {u.username} — Role: {u.role} — Email: {u.email}
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </section>

      <section>
        <h3>All Submissions ({submissions.length})</h3>
        {submissions.length > 0 ? (
          <ul>
            {submissions.map(s => (
              <li key={s.id}>
                Student: {s.student} → Assignment: {s.assignment} | Grade: {s.grade || 'Not graded'}
              </li>
            ))}
          </ul>
        ) : (
          <p>No submissions yet.</p>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;