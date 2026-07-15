import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getCart = async () => {
  const response = await axios.get(`${API_BASE_URL}/cart`);
  return response.data;
};

export const addToCart = async (productId, variantId = null, quantity = 1) => {
  const response = await axios.post(`${API_BASE_URL}/cart`, {
    product_id: productId,
    variant_id: variantId,
    quantity
  });
  return response.data;
};

export const updateCartItem = async (id, quantity) => {
  const response = await axios.put(`${API_BASE_URL}/cart/${id}`, { quantity });
  return response.data;
};

export const removeCartItem = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/cart/${id}`);
  return response.data;
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
