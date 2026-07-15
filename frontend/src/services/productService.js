import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Product Service to communicate with Laravel APIs
 */
export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.category && filters.category !== 'all') params.append('category', filters.category);
  if (filters.subcategory) params.append('subcategory', filters.subcategory);
  if (filters.brand && filters.brand.length > 0) {
    if (Array.isArray(filters.brand)) {
      filters.brand.forEach(b => params.append('brand[]', b));
    } else {
      params.append('brand', filters.brand);
    }
  }
  if (filters.vendor) params.append('vendor', filters.vendor);
  if (filters.rating) params.append('rating', filters.rating);
  if (filters.featured !== undefined) params.append('featured', filters.featured);
  if (filters.minPrice) params.append('min_price', filters.minPrice);
  if (filters.maxPrice) params.append('max_price', filters.maxPrice);
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.page) params.append('page', filters.page);

  const response = await axios.get(`${API_BASE_URL}/products`, { params });
  return response.data;
};

export const getProduct = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/products/${id}`);
  return response.data;
};

export const getRelatedProducts = async (slug) => {
  const response = await axios.get(`${API_BASE_URL}/products/${slug}/related`);
  return response.data;
};

export const getProductReviews = async (slug) => {
  const response = await axios.get(`${API_BASE_URL}/products/${slug}/reviews`);
  return response.data;
};

export const searchProducts = async (query) => {
  return getProducts({ search: query });
};

export const filterProducts = async (filters) => {
  return getProducts(filters);
};
export default {
  getProducts,
  getProduct,
  getRelatedProducts,
  getProductReviews,
  searchProducts,
  filterProducts,
};
