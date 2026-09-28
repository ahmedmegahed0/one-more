import { apiClient } from './client';

let categoriesCache = null;
let categoriesPromise = null;

export const categoriesApi = {
  getCategories: (pageIndex = 1, pageSize = 10) => {
    if (pageIndex === 1 && pageSize === 100) {
      if (categoriesCache) return Promise.resolve(categoriesCache);
      if (categoriesPromise) return categoriesPromise;
      
      categoriesPromise = apiClient.get('/api/Categories', {
        params: { PageIndex: pageIndex, PageSize: pageSize }
      }).then(res => {
        categoriesCache = res;
        categoriesPromise = null;
        return res;
      }).catch(err => {
        categoriesPromise = null;
        throw err;
      });
      return categoriesPromise;
    }
    return apiClient.get('/api/Categories', {
      params: { PageIndex: pageIndex, PageSize: pageSize }
    });
  },

  createCategory: async (formData) => {
    const res = await apiClient.post('/api/Categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    categoriesCache = null;
    return res;
  },

  updateCategory: async (id, formData) => {
    const res = await apiClient.put(`/api/Categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    categoriesCache = null;
    return res;
  },

  deleteCategory: async (id) => {
    const res = await apiClient.delete(`/api/Categories/${id}`);
    categoriesCache = null;
    return res;
  }
};
