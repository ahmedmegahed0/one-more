import { apiClient } from './client';

export const ordersApi = {
  getTodayOrders: async ({ pageIndex = 1, pageSize = 10, status = null }) => {
    return apiClient.get('/api/Orders', {
      params: { PageIndex: pageIndex, PageSize: pageSize, ...(status && { Status: status }) }
    });
  },

  getHistoricalOrders: async ({ date, pageIndex = 1, pageSize = 10, status = null }) => {
    return apiClient.get('/api/Orders/history', {
      params: { Date: date, PageIndex: pageIndex, PageSize: pageSize, ...(status && { Status: status }) }
    });
  },

  createOrder: async (orderPayload) => {
    return apiClient.post('/api/Orders', orderPayload);
  },

  moveOrderToPrepare: async (id) => {
    return apiClient.post(`/api/Orders/${id}/to-prepare`, {
      orderId: id
    });
  },

  moveOrderToOnWay: async (id, deliveryId) => {
    return apiClient.post(`/api/Orders/${id}/to-on-way`, {
      orderId: id,
      deliveryId: parseInt(deliveryId)
    });
  },

  cancelOrder: async (id, cancellationReason) => {
    return apiClient.patch(`/api/Orders/${id}/cancel`, {
      orderId: id,
      cancellationReason
    });
  },

  markWhatsAppSent: async (id) => {
    return apiClient.post(`/api/Orders/${id}/whatsapp-sent`);
  },

  getOrderInvoice: async (id) => {
    return apiClient.get(`/api/Orders/${id}/invoice`);
  },

  getCustomerHistory: async ({ phoneNumber, pageIndex = 1, pageSize = 10 }) => {
    return apiClient.get('/api/Orders/customer-history', {
      params: { PhoneNumber: phoneNumber, PageIndex: pageIndex, PageSize: pageSize }
    });
  }
};
