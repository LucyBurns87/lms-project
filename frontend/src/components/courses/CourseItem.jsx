import React from 'react';

const CourseItem = ({ course }) => {
  const handleEnroll = () => {
    // Logic to enroll in the course
    alert(`Enrolled in ${course.title}!`);
  };

  return (
    <li>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <button onClick={handleEnroll}>Enroll</button>
    </li>
  );
};

export default CourseItem;