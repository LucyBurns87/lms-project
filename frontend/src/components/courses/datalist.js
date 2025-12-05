import React from "react";

// Course data (could later come from your Django API)
const courses = [
  {
    name: "HTML Course",
    description: "Learn the structure of web pages using HTML tags, elements, and semantic markup."
  },
  {
    name: "CSS Learning",
    description: "Style your websites with CSS, mastering layouts, colors, and responsive design."
  },
  {
    name: "JavaScript",
    description: "Add interactivity to your sites with JavaScript fundamentals and DOM manipulation."
  },
  {
    name: "UI and UX",
    description: "Explore design principles to create user-friendly, accessible, and visually appealing interfaces."
  },
  {
    name: "React and Redux",
    description: "Build dynamic frontends with React components and manage state effectively using Redux."
  },
  {
    name: "GitHub",
    description: "Master version control with Git and GitHub, including branching, pull requests, and collaboration."
  },
  {
    name: "Agile",
    description: "Understand Agile methodologies, Scrum practices, and how to manage projects iteratively."
  },
  {
    name: "Python",
    description: "Learn Python programming basics, from syntax to problem-solving and automation."
  },
  {
    name: "Django",
    description: "Build robust web applications with Django, covering models, views, templates, and REST APIs."
  }
];

function CourseList() {
  return (
    <div className="course-list">
      <h1>myCODEcourse</h1>
      <div className="courses-grid">
        {courses.map((course, index) => (
          <div key={index} className="course-card">
            <h3>{course.name}</h3>
            <p>{course.description}</p>
            <button>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseList;