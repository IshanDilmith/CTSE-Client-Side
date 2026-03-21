import api from "./api";

/**
 * GET /inventory/products
 * Fetches all products
 */
export const getAllProducts = async () => {
  const response = await api.get("/inventory/products");
  return response.data;
};

/**
 * GET /inventory/products/:id
 * Fetches a single product by ID
 */
export const getProductById = async (id) => {
  const response = await api.get(`/inventory/products/${id}`);
  return response.data;
};

/**
 * POST /inventory/products
 * Creates a new product (admin only)
 * Uses FormData for image uploads
 */
export const createProduct = async (formData) => {
  const response = await api.post("/inventory/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * PUT /inventory/products/:id
 * Updates an existing product (admin only)
 * Uses FormData for image uploads
 */
export const updateProduct = async (id, formData) => {
  const response = await api.put(`/inventory/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * DELETE /inventory/products/:id
 * Deletes a product (admin only)
 */
export const deleteProduct = async (id) => {
  const response = await api.delete(`/inventory/products/${id}`);
  return response.data;
};

/**
 * POST /inventory/products/check-stock
 * Checks if stock is available for a product
 */
export const checkStock = async (productId, quantity) => {
  const response = await api.post("/inventory/products/check-stock", {
    productId,
    quantity,
  });
  return response.data;
};
