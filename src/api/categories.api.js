import { apiClient } from './client';

export const categoriesApi = {
  getCategories: async (pageIndex = 1, pageSize = 10) => {
    return apiClient.get('/api/Categories', {
      params: { PageIndex: pageIndex, PageSize: pageSize }
    });
  },

  createCategory: async (formData) => {
    return apiClient.post('/api/Categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  updateCategory: async (id, formData) => {
    return apiClient.put(`/api/Categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteCategory: async (id) => {
    return apiClient.delete(`/api/Categories/${id}`);
  }
};
