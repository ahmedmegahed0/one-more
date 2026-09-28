import { apiClient } from './client';

let settingsCache = null;
let settingsPromise = null;

export const settingsApi = {
  getSettings: () => {
    if (settingsCache) return Promise.resolve(settingsCache);
    if (settingsPromise) return settingsPromise;
    
    settingsPromise = apiClient.get('/api/Settings').then(res => {
      settingsCache = res;
      settingsPromise = null;
      return res;
    }).catch(err => {
      settingsPromise = null;
      throw err;
    });
    return settingsPromise;
  },

  updateSettings: async (formData) => {
    const res = await apiClient.put('/api/Settings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    settingsCache = null;
    return res;
  }
};
