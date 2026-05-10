import { request, authHeader } from './baseApi';
import type { User } from './types';

const usersPath = '/users';

export const usersAPI = {
  getAll: async (token: string) => {
    return request<User[]>(usersPath, {
      method: 'GET',
      headers: {
        ...authHeader(token),
      },
    });
  },

  getById: async (token: string, id: string) => {
    return request<User>(`${usersPath}/${id}`, {
      method: 'GET',
      headers: {
        ...authHeader(token),
      },
    });
  },

  create: async (token: string, payload: FormData) => {
    return request<User>(usersPath, {
      method: 'POST',
      headers: {
        ...authHeader(token),
      },
      body: payload,
    });
  },

  update: async (token: string, id: string, payload: Partial<User> | FormData) => {
    const isFormData = payload instanceof FormData;
    
    return request<{ message: string }>(`${usersPath}/${id}`, {
      method: 'PUT',
      headers: isFormData ? authHeader(token) : {
        'Content-Type': 'application/json',
        ...authHeader(token),
      },
      body: isFormData ? payload : JSON.stringify(payload),
    });
  },

  delete: async (token: string, id: string) => {
    return request<{ message: string }>(`${usersPath}/${id}`, {
      method: 'DELETE',
      headers: {
        ...authHeader(token),
      },
    });
  },
};
