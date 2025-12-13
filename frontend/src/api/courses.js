import API from "./axios";


export async function getCourses() {
  const response = await API.get("/courses/");
  return response.data;
}

export async function getCourse(id) {
  const response = await API.get(`/courses/${id}/`);
  return response.data;
}

export async function createCourse(courseData) {
  const response = await API.post("/courses/", courseData);
  return response.data;
}

export async function updateCourse(id, courseData) {
  const response = await API.put(`/courses/${id}/`, courseData);
  return response.data;
}

export async function deleteCourse(id) {
  const response = await API.delete(`/courses/${id}/`);
  return response.data;
}