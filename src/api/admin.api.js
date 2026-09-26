import { apiClient } from './client';

export const adminApi = {
  getStaff: async (pageIndex = 1, pageSize = 10) => {
    return apiClient.get('/api/Admin/staff', {
      params: { PageIndex: pageIndex, PageSize: pageSize }
    });
  },

  createStaff: async (data) => {
    return apiClient.post('/api/Admin/staff', data);
  },

  deleteUser: async (id) => {
    return apiClient.delete(`/api/Admin/users/${id}`);
  },

  deleteOrder: async (id) => {
    return apiClient.delete(`/api/Admin/orders/${id}`);
  },

  setNotificationRecipient: async (email) => {
    return apiClient.put('/api/admin/notification-recipient', { email });
  },

  deleteNotificationRecipient: async () => {
    return apiClient.delete('/api/admin/notification-recipient');
  }
};
