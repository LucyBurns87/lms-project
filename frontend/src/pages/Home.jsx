import React, { useState, useEffect } from 'react';
import apiClient from '../api/api';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded course list with descriptions
  const coursesData = [
    { id: 1, name: "HTML Course", link: "html-course.html", description: "Learn HTML basics: elements, structure and semantics." },
    { id: 2, name: "CSS Learning", link: "#", description: "Style web pages: selectors, box model, layout and responsive design." },
    { id: 3, name: "Javascript", link: "#", description: "Core JavaScript: syntax, DOM, async programming and ES6+ features." },
    { id: 4, name: "UI and UX", link: "#", description: "Design principles, user research, wireframing and prototyping." },
    { id: 5, name: "React and Redux", link: "#", description: "Build SPA with React, manage state with Redux and side effects." },
    { id: 6, name: "GitHub", link: "#", description: "Version control with Git, branching, pull requests and collaboration." },
    { id: 7, name: "Agile", link: "#", description: "Agile methodologies: Scrum, Kanban and iterative delivery." },
    { id: 8, name: "Python", link: "#", description: "Python fundamentals: data types, control flow, modules and OOP." },
    { id: 9, name: "Django", link: "#", description: "Web development with Django: models, views, templates and REST APIs." },
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  // simulate async fetch for hardcoded data
  const fetchCourses = async () => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 200));
      setCourses(coursesData);
    } catch (err) {
      console.error('Failed to load courses', err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    if (course.link && course.link !== "#") {
      window.location.href = course.link;
    } else {
      // placeholder for future routing
      alert(`Opening course: ${course.name}`);
    }
  };

  const handleLogin = (role) => {
    alert(`Login as ${role} functionality coming soon!`);
  };

  return (
    <div className="container">
      <h1>
        Welcome to{''}
        <span className="highlight">C</span>
        <span className="highlight">O</span>
        <span className="highlight">D</span>
        <span className="highlight">E</span>
        <span className="highlight">F</span>
        <span className="highlight">O</span>
        <span className="highlight">R</span>
        <span className="highlight">Y</span>
        <span className="highlight">O</span>
        <span className="highlight">U</span>
      </h1>

      <h2>Learn and track your progress with online support!</h2>

      <h2 className="highlight">Courses</h2>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <ul style={{ padding: 0 }}>
          {courses.length === 0 ? (
            <li>No courses available.</li>
          ) : (
            courses.map((course) => (
              <li key={course.id} style={{ marginBottom: 16, listStyle: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button className="course-button" onClick={() => handleCourseClick(course)}>
                    {course.name}
                  </button>
                  <span style={{ color: '#666' }}>{course.description}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Home;