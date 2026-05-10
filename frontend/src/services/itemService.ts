import { request, authHeader } from './baseApi';
import type { DefaultItem, ItemPayload } from './types';

const itemsPath = '/items';

export const itemsAPI = {
  getAll: async (token: string) => {
    return request<DefaultItem[]>(itemsPath, {
      method: 'GET',
      headers: {
        ...authHeader(token),
      },
    });
  },

  getById: async (token: string, id: string) => {
    return request<DefaultItem>(`${itemsPath}/${id}`, {
      method: 'GET',
      headers: {
        ...authHeader(token),
      },
    });
  },

  create: async (token: string, payload: ItemPayload | FormData) => {
    const isFormData = payload instanceof FormData;
    
    return request<DefaultItem>(itemsPath, {
      method: 'POST',
      headers: isFormData ? authHeader(token) : {
        'Content-Type': 'application/json',
        ...authHeader(token),
      },
      body: isFormData ? payload : JSON.stringify(payload),
    });
  },

  update: async (token: string, id: string, payload: Partial<ItemPayload> | FormData) => {
    const isFormData = payload instanceof FormData;
    
    return request<DefaultItem>(`${itemsPath}/${id}`, {
      method: 'PUT',
      headers: isFormData ? authHeader(token) : {
        'Content-Type': 'application/json',
        ...authHeader(token),
      },
      body: isFormData ? payload : JSON.stringify(payload),
    });
  },

  delete: async (token: string, id: string) => {
    return request<{ message: string }>(`${itemsPath}/${id}`, {
      method: 'DELETE',
      headers: {
        ...authHeader(token),
      },
    });
  },
};

export const defaultItemsAPI = itemsAPI;
