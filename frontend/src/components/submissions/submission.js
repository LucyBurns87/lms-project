/**
 * Submission API calls
 * Handles all submission-related HTTP requests
 */
import apiClient from './apiClient';

/**
 * Get all submissions (filtered by role on backend)
 * Students see their own, teachers see their course submissions
 */
export const getSubmissions = async (assignmentId = null) => {
  const url = assignmentId 
    ? `/assignments/submissions/?assignment=${assignmentId}` 
    : '/assignments/submissions/';
  const response = await apiClient.get(url);
  return response.data;
};

/**
 * Get single submission details
 * @param {number} id - Submission ID
 */
export const getSubmission = async (id) => {
  const response = await apiClient.get(`/assignments/submissions/${id}/`);
  return response.data;
};

/**
 * Submit assignment (student)
 * @param {object} submissionData - {assignment, content, file}
 */
export const submitAssignment = async (submissionData) => {
  const response = await apiClient.post('/assignments/submissions/', submissionData);
  return response.data;
};

/**
 * Grade submission (teacher)
 * @param {number} submissionId - Submission ID
 * @param {number} grade - Grade (0-100)
 * @param {string} feedback - Teacher's feedback
 */
export const gradeSubmission = async (submissionId, grade, feedback) => {
  const response = await apiClient.patch(`/assignments/submissions/${submissionId}/`, {
    grade,
    feedback,
  });
  return response.data;
};

/**
 * Update submission
 * @param {number} id - Submission ID
 * @param {object} submissionData - Updated fields
 */
export const updateSubmission = async (id, submissionData) => {
  const response = await apiClient.put(`/assignments/submissions/${id}/`, submissionData);
  return response.data;
};

/**
 * Delete submission
 * @param {number} id - Submission ID
 */
export const deleteSubmission = async (id) => {
  await apiClient.delete(`/assignments/submissions/${id}/`);
};