import { apiClient } from './client';

export const productsApi = {
  getProducts: async (pageIndex = 1, pageSize = 10) => {
    return apiClient.get('/api/Products', {
      params: { PageIndex: pageIndex, PageSize: pageSize }
    });
  },

  createProduct: async (formData) => {
    return apiClient.post('/api/Products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  updateProduct: async (id, formData) => {
    return apiClient.put(`/api/Products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteProduct: async (id) => {
    return apiClient.delete(`/api/Products/${id}`);
  }
};
