import API from "./axios";

export async function enrollInCourse(courseId) {
  return API.post("/courses/enrollments/", { course: courseId });
}

export async function getMyEnrollments() {
  const response = await API.get("/courses/enrollments/my_enrollments/");
  return response.data;
}