/**
 * Assignment API calls
 * Handles all assignment-related HTTP requests
 */
import apiClient from './apiClient';

/**
 * Get all assignments (filtered by role on backend)
 * Teachers see their course assignments, students see enrolled course assignments
 */
export const getAssignments = async (courseId = null) => {
  const url = courseId 
    ? `/assignments/?course=${courseId}` 
    : '/assignments/';
  const response = await apiClient.get(url);
  return response.data;
};

/**
 * Get single assignment details
 * @param {number} id - Assignment ID
 */
export const getAssignment = async (id) => {
  const response = await apiClient.get(`/assignments/${id}/`);
  return response.data;
};

/**
 * Create new assignment (teacher/admin only)
 * @param {object} assignmentData - {course, title, description, due_date}
 */
export const createAssignment = async (assignmentData) => {
  const response = await apiClient.post('/assignments/', assignmentData);
  return response.data;
};

/**
 * Update assignment (teacher/admin only)
 * @param {number} id - Assignment ID
 * @param {object} assignmentData - Updated fields
 */
export const updateAssignment = async (id, assignmentData) => {
  const response = await apiClient.put(`/assignments/${id}/`, assignmentData);
  return response.data;
};

/**
 * Partial update assignment (teacher/admin only)
 * @param {number} id - Assignment ID
 * @param {object} assignmentData - Fields to update
 */
export const patchAssignment = async (id, assignmentData) => {
  const response = await apiClient.patch(`/assignments/${id}/`, assignmentData);
  return response.data;
};

/**
 * Delete assignment (teacher/admin only)
 * @param {number} id - Assignment ID
 */
export const deleteAssignment = async (id) => {
  await apiClient.delete(`/assignments/${id}/`);
};