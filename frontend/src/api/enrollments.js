import API from "./axios";

export async function enrollInCourse(courseId) {
  return API.post("/enrollments/", { course: courseId });
}

export async function getMyEnrollments() {
  const response = await API.get("/enrollments/");
  return response.data;
}