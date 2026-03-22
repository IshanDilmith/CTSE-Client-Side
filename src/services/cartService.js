import api from "./api";

/**
 * GET /cart/:userId
 * Retrieves the cart for a user
 */
export const getCart = async (userId) => {
  const response = await api.get(`/cart/${userId}`);
  console.log("Cart Data: ", response.data)
  return response.data;
};

/**
 * POST /cart/add
 * Adds an item to the cart
 */
export const addItem = async (userId, productId, quantity = 1) => {
  const response = await api.post("/cart/add", { userId, productId, quantity });
  console.log("Cart adding: ", response.data)
  return response.data;
};

/**
 * DELETE /cart/remove
 * Removes an item from the cart
 */
export const removeItem = async (userId, productId) => {
  const response = await api.delete("/cart/remove", {
    data: { userId, productId },
  });
  return response.data;
};

/**
 * DELETE /cart/clear/:userId
 * Clears the user's cart
 */
export const clearCart = async (userId) => {
  const response = await api.delete(`/cart/clear/${userId}`);
  return response.data;
};
