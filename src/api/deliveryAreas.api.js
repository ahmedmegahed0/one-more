import { apiClient } from './client';

export const deliveryAreasApi = {
  getDeliveryAreas: async (pageIndex = 1, pageSize = 100) => {
    return apiClient.get('/api/DeliveryAreas', {
      params: { PageIndex: pageIndex, PageSize: pageSize }
    });
  },

  createDeliveryArea: async (data) => {
    return apiClient.post('/api/DeliveryAreas', data);
  },

  updateDeliveryArea: async (id, data) => {
    return apiClient.put(`/api/DeliveryAreas/${id}`, { id, ...data });
  },

  deleteDeliveryArea: async (id) => {
    return apiClient.delete(`/api/DeliveryAreas/${id}`);
  }
};
