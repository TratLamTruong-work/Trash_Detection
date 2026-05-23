import { request, authHeader } from './baseApi';
import type { PointTransaction } from './types';

const pointTransactionPath = '/point_transactions';

export const pointTransactionAPI = {
  getAll: async (token: string) => {
    return request<PointTransaction[]>(pointTransactionPath, {
      method: 'GET',
      headers: {
        ...authHeader(token),
      },
    });
  },

  getById: async (token: string, id: string) => {
    return request<PointTransaction>(`${pointTransactionPath}/${id}`, {
      method: 'GET',
      headers: {
        ...authHeader(token),
      },
    });
  },

  delete: async (token: string, id: string) => {
    return request<{ message: string }>(`${pointTransactionPath}/${id}`, {
      method: 'DELETE',
      headers: {
        ...authHeader(token),
      },
    });
  },

  updateStatus: async (token: string, id: string, status: string) => {
    return request<PointTransaction>(`${pointTransactionPath}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(token),
      },
      body: JSON.stringify({ status }),
    });
  },
};
