import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getWishlist = async () => {
  const response = await axios.get(`${API_BASE_URL}/wishlist`);
  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await axios.post(`${API_BASE_URL}/wishlist`, {
    product_id: productId
  });
  return response.data;
};

export const removeWishlistItem = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/wishlist/${id}`);
  return response.data;
};

export default {
  getWishlist,
  addToWishlist,
  removeWishlistItem,
};
