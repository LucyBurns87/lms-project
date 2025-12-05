import React from "react";
import { enrollInCourse } from "../../api/enrollments";
import { deleteCourse } from "../../api/courses";

function CourseCard({ course, user }) {
  const handleEnroll = async () => {
    await enrollInCourse(course.id);
    alert(`Enrolled in ${course.title}`);
  };

  const handleDelete = async () => {
    await deleteCourse(course.id);
    alert(`Deleted ${course.title}`);
  };

  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <p>{course.description}</p>

      {user.role === "student" && (
        <button className="btn btn-primary" onClick={handleEnroll}>Enroll</button>
      )}

      <button className="btn btn-secondary">View Details</button>

      {(user.role === "teacher" || user.role === "admin") && (
        <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
      )}
    </div>
  );
}

export default CourseCard;
