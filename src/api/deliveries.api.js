import { apiClient } from './client';

export const deliveriesApi = {
  getDeliveries: async (pageIndex = 1, pageSize = 10) => {
    return apiClient.get('/api/Deliveries', {
      params: { PageIndex: pageIndex, PageSize: pageSize }
    });
  },

  createDelivery: async (data) => {
    return apiClient.post('/api/Deliveries', data);
  },

  updateDelivery: async (id, data) => {
    return apiClient.put(`/api/Deliveries/${id}`, { id, ...data });
  },

  deleteDelivery: async (id) => {
    return apiClient.delete(`/api/Deliveries/${id}`);
  }
};
