import { apiClient } from './client';

export const settingsApi = {
  getSettings: async () => {
    return apiClient.get('/api/Settings');
  },

  updateSettings: async (formData) => {
    return apiClient.put('/api/Settings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
