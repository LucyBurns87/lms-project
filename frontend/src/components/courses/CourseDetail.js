import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import apiClient from '../../api/api';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const courseResponse = await apiClient.get(`/courses/${id}/`);
      setCourse(courseResponse.data);

      const assignmentResponse = await apiClient.get(`/assignments/?course=${id}`);
      setAssignments(assignmentResponse.data);
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      await apiClient.post(`/courses/${id}/enroll/`);
      setMessage(`Successfully enrolled in ${course.title}!`);
    } catch (error) {
      setMessage('Error enrolling. You may already be enrolled.');
    }
  };

  if (loading) return <p>Loading course details...</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <div className="container">
      <h1>{course.title}</h1>
      <p>{course.description}</p>

      {user && user.role === 'student' && (
        <button onClick={handleEnroll}>Enroll</button>
      )}
      {message && <p>{message}</p>}

      <h2>Assignments</h2>
      {assignments.length > 0 ? (
        <ul>
          {assignments.map((a) => (
            <li key={a.id}>
              <strong>{a.title}</strong> — Due: {a.due_date}
            </li>
          ))}
        </ul>
      ) : (
        <p>No assignments yet for this course.</p>
      )}
    </div>
  );
};

export default CourseDetail;
