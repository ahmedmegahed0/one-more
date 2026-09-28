import { apiClient } from './client';

let areasCache = null;
let areasPromise = null;

export const deliveryAreasApi = {
  getDeliveryAreas: (pageIndex = 1, pageSize = 100) => {
    if (pageIndex === 1 && pageSize === 100) {
      if (areasCache) return Promise.resolve(areasCache);
      if (areasPromise) return areasPromise;
      
      areasPromise = apiClient.get('/api/DeliveryAreas', {
        params: { PageIndex: pageIndex, PageSize: pageSize }
      }).then(res => {
        areasCache = res;
        areasPromise = null;
        return res;
      }).catch(err => {
        areasPromise = null;
        throw err;
      });
      return areasPromise;
    }
    return apiClient.get('/api/DeliveryAreas', {
      params: { PageIndex: pageIndex, PageSize: pageSize }
    });
  },

  createDeliveryArea: async (data) => {
    const res = await apiClient.post('/api/DeliveryAreas', data);
    areasCache = null;
    return res;
  },

  updateDeliveryArea: async (id, data) => {
    const res = await apiClient.put(`/api/DeliveryAreas/${id}`, { id, ...data });
    areasCache = null;
    return res;
  },

  deleteDeliveryArea: async (id) => {
    const res = await apiClient.delete(`/api/DeliveryAreas/${id}`);
    areasCache = null;
    return res;
  }
};
