import api from "./api";

/**
 * POST /orders/create
 * Creates a new order
 */
export const createOrder = async (orderData) => {
  const response = await api.post("/orders/create", orderData);
  return response.data;
};

/**
 * GET /orders/my-orders
 * Gets orders for the authenticated user
 */
export const getMyOrders = async () => {
  const response = await api.get("/orders/my-orders");
  return response.data;
};

/**
 * GET /orders/:id
 * Gets a specific order by ID
 */
export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

/**
 * GET /orders
 * Gets all orders (Admin)
 */
export const getAllOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

/**
 * PATCH /orders/:id/status
 * Updates the status of an order
 */
export const updateOrderStatus = async (id, status) => {
  const response = await api.patch(`/orders/${id}/status`, { status });
  return response.data;
};
