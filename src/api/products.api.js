import { apiClient } from './client';

let productsCache = null;
let productsPromise = null;

export const productsApi = {
  getProducts: (pageIndex = 1, pageSize = 10) => {
    if (pageIndex === 1 && pageSize === 100) {
      if (productsCache) return Promise.resolve(productsCache);
      if (productsPromise) return productsPromise;
      
      productsPromise = apiClient.get('/api/Products', {
        params: { PageIndex: pageIndex, PageSize: pageSize }
      }).then(res => {
        productsCache = res;
        productsPromise = null;
        return res;
      }).catch(err => {
        productsPromise = null;
        throw err;
      });
      return productsPromise;
    }
    return apiClient.get('/api/Products', {
      params: { PageIndex: pageIndex, PageSize: pageSize }
    });
  },

  createProduct: async (formData) => {
    const res = await apiClient.post('/api/Products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    productsCache = null;
    return res;
  },

  updateProduct: async (id, formData) => {
    const res = await apiClient.put(`/api/Products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    productsCache = null;
    return res;
  },

  deleteProduct: async (id) => {
    const res = await apiClient.delete(`/api/Products/${id}`);
    productsCache = null;
    return res;
  }
};
