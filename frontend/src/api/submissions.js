/**
 * Submission API calls
 */
import apiClient from './axios';

// Get all submissions (filtered by role on backend)
export const getSubmissions = async (assignmentId = null) => {
  const url = assignmentId 
    ? `/assignments/submissions/?assignment=${assignmentId}` 
    : '/assignments/submissions/';
  const response = await apiClient.get(url);
  return response.data;
};

// Get single submission
export const getSubmission = async (id) => {
  const response = await apiClient.get(`/assignments/submissions/${id}/`);
  return response.data;
};

// Submit assignment (student) - using simple endpoint
export const submitAssignment = async (submissionData) => {
  const response = await apiClient.post('/assignments/simple-submit/', submissionData);
  return response.data;
};

// Grade submission (teacher)
export const gradeSubmission = async (submissionId, grade, feedback) => {
  const response = await apiClient.patch(`/assignments/submissions/${submissionId}/`, {
    grade,
    feedback,
  });
  return response.data;
};

// Update submission
export const updateSubmission = async (id, submissionData) => {
  const response = await apiClient.put(`/assignments/submissions/${id}/`, submissionData);
  return response.data;
};

// Delete submission
export const deleteSubmission = async (id) => {
  await apiClient.delete(`/assignments/submissions/${id}/`);
};