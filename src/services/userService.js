import api from "./api";

/**
 * GET /auth/users/:id
 * Fetches user profile by ID
 */
export const fetchUserProfile = async (userId) => {
  const response = await api.get(`/auth/users/${userId}`);
  return response.data;
};
