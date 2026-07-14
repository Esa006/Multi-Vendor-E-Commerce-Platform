import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getBrands = async () => {
  const response = await axios.get(`${API_BASE_URL}/brands`);
  return response.data;
};

export default {
  getBrands,
};
