import { apiClient } from './client';

export const couponsApi = {
  getCoupons: async () => {
    return apiClient.get('/api/Coupons');
  },

  createCoupon: async (data) => {
    return apiClient.post('/api/Coupons', data);
  },

  deleteCoupon: async (id) => {
    return apiClient.delete(`/api/Coupons/${id}`);
  }
};
