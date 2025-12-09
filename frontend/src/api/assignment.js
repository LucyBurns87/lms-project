import apiClient from './axios';

// ============= ASSIGNMENTS =============

export const getAssignments = async (courseId = null) => {
  const url = courseId ? `/assignments/?course=${courseId}` : '/assignments/';
  const response = await apiClient.get(url);
  return response.data;
};

export const getAssignment = async (id) => {
  const response = await apiClient.get(`/assignments/${id}/`);
  return response.data;
};

export const createAssignment = async (assignmentData) => {
  const response = await apiClient.post('/assignments/', assignmentData);
  return response.data;
};

export const updateAssignment = async (id, assignmentData) => {
  const response = await apiClient.put(`/assignments/${id}/`, assignmentData);
  return response.data;
};

export const deleteAssignment = async (id) => {
  await apiClient.delete(`/assignments/${id}/`);
};

// ============= SUBMISSIONS =============

export const getSubmissions = async (assignmentId = null) => {
  const url = assignmentId ? `/assignments/submissions/?assignment=${assignmentId}` : '/assignments/submissions/';
  const response = await apiClient.get(url);
  return response.data;
};

export const submitAssignment = async (assignmentId, submissionData) => {
  const response = await apiClient.post('/assignments/submissions/', {
    assignment: assignmentId,
    ...submissionData
  });
  return response.data;
};

export const gradeSubmission = async (submissionId, grade, feedback) => {
  const response = await apiClient.patch(`/assignments/submissions/${submissionId}/`, {
    grade,
    feedback
  });
  return response.data;
};

export const updateSubmission = async (id, submissionData) => {
  const response = await apiClient.put(`/assignments/submissions/${id}/`, submissionData);
  return response.data;
};

export const deleteSubmission = async (id) => {
  await apiClient.delete(`/assignments/submissions/${id}/`);
};