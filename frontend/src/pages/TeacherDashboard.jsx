import React, { useEffect, useState } from "react";
import apiClient from '../api/axios';
import useAuth from '../hooks/useAuth';
import "./TeacherDashboard.css";

function TeacherEnrollments({ courseId }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const response = await apiClient.get(`/courses/enrollments/?course=${courseId}`);
        setEnrollments(response.data);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEnrollments();
  }, [courseId]);

  if (loading) return <p>Loading enrollments...</p>;

  return (
    <ul className="enrolled-students">
      {enrollments.length > 0 ? (
        enrollments.map(e => (
          <li key={e.id}>
            {e.student_username} — enrolled on {new Date(e.date_enrolled).toLocaleDateString()}
          </li>
        ))
      ) : (
        <li>No students enrolled yet.</li>
      )}
    </ul>
  );
}

function CreateCourseForm({ onCourseCreated, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/courses/', formData);
      onCourseCreated(response.data);
      alert('Course created successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create course');
      console.error('Error creating course:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-form">
      <h3>Create New Course</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            maxLength={200}
            placeholder="e.g., Introduction to Python"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            placeholder="Course description..."
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Course'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function TeacherDashboard() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  async function fetchData() {
    setLoading(true);
    try {
      const coursesResponse = await apiClient.get(`/courses/?created_by=${user.id}`);
      setCourses(coursesResponse.data);
      setSubmissions([]); // Empty for now until we have assignments
    } catch (error) {
      console.error("Error fetching teacher data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  const handleCourseCreated = (newCourse) => {
    setCourses([...courses, newCourse]);
    setShowCreateForm(false);
  };

  const handleGradeSubmission = async (submissionId) => {
    const grade = prompt("Enter grade (0-100):");
    const feedback = prompt("Enter feedback:");
    
    if (grade === null || feedback === null) return;

    try {
      await apiClient.patch(`/assignments/submissions/${submissionId}/`, {
        grade: parseInt(grade),
        feedback: feedback
      });
      alert("Submission graded successfully!");
      const response = await apiClient.get("/assignments/submissions/");
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error grading submission:", error);
      alert("Failed to grade submission");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await apiClient.delete(`/courses/${courseId}/`);
      setCourses(courses.filter(c => c.id !== courseId));
      alert("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course");
    }
  };

  if (!user) return <p>Loading user data...</p>;
  if (loading) return <p>Loading teacher dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="teacher-dashboard">
      <h1>Welcome, {user.username}</h1>

      <section>
        <h2>Submissions to Grade</h2>
        {submissions.length > 0 ? (
          <ul>
            {submissions.map(s => (
              <li key={s.id}>
                Student: {s.student} | Assignment: {s.assignment} | Grade: {s.grade || 'Not graded'}
                <button 
                  className="btn btn-primary"
                  onClick={() => handleGradeSubmission(s.id)}
                >
                  Grade
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No submissions to grade.</p>
        )}
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>My Courses</h2>
          {!showCreateForm && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateForm(true)}
            >
              + Create Course
            </button>
          )}
        </div>

        {showCreateForm && (
          <CreateCourseForm
            onCourseCreated={handleCourseCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {courses.length > 0 ? (
          <div className="courses-grid">
            {courses.map(course => (
              <div key={course.id} className="course-card">
                <h3>{course.title}</h3>
                <p>{course.description}</p>

                <h4>Enrolled Students</h4>
                <TeacherEnrollments courseId={course.id} />

                <button 
                  className="btn btn-danger"
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  Delete Course
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't created any courses yet.</p>
        )}
      </section>
    </div>
  );
}

export default TeacherDashboard;