import { apiClient } from './client';

export const statisticsApi = {
  getStatistics: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.StartDate = startDate;
    if (endDate) params.EndDate = endDate;
    
    return apiClient.get('/api/Statistics', { params });
  }
};
