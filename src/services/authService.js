import api from "./api";

/**
 * POST /auth/login
 * Authenticates user with email and password
 */
export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

/**
 * POST /auth/register
 * Registers a new user
 */
export const registerUser = async ({ name, email, password, role }) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
    role: role || "customer",
  });
  return response.data;
};

/**
 * GET /auth/me
 * Fetches the currently authenticated user profile
 */
export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

/**
 * GET /auth/users/:id
 * Fetches a specific user by ID (admin)
 */
export const getUserById = async (id) => {
  const response = await api.get(`/auth/users/${id}`);
  return response.data;
};
