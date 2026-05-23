import { request, authHeader } from './baseApi';
import type { TrashBinStatus } from './types';

const binPath = '/distance';

export const binAPI = {
  getAll: async (token: string) => {
    return request<TrashBinStatus[]>(binPath, {
      method: 'GET',
      headers: {
        ...authHeader(token),
      },
    });
  },
};
