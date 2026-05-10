import { request, authHeader } from './baseApi';
import type { TradeHistoryPayload, TradeHistory } from './types';

const tradeHistoryPath = '/trade_history';

export const tradeHistoriesAPI = {
  getAll: async (token: string) => {
    const response = await request<TradeHistory[]>(tradeHistoryPath, {
      method: 'GET',
      headers: {
        ...authHeader(token),
      },
    });

    return response;
  },

  create: async (token: string, payload: TradeHistoryPayload) => {
    return request<TradeHistory>(tradeHistoryPath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(token),
      },
      body: JSON.stringify({
        userId: payload.userId,
        itemId: payload.itemId,
        quantity: payload.quantityTraded,
      }),
    });
  },

  update: async () => {
    throw new Error('Trade history update is not supported by the current backend routes.');
  },

  delete: async (token: string, id: string) => {
    return request<{ message: string }>(`${tradeHistoryPath}/${id}`, {
      method: 'DELETE',
      headers: {
        ...authHeader(token),
      },
    });
  },

  deleteAll: async (token: string) => {
    return request<{ message: string }>(tradeHistoryPath, {
      method: 'DELETE',
      headers: {
        ...authHeader(token),
      },
    });
  },
};
