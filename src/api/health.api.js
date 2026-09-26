import { apiClient } from './client';

export const healthApi = {
  getApiInfo: async () => {
    return apiClient.get('/');
  },

  getHealthCheck: async () => {
    return apiClient.get('/health');
  }
};
