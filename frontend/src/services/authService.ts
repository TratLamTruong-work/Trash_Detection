import { request } from './baseApi';
import type { SignUpParams, User } from './types';

export type AuthSignInData = {
  accessToken: string;
  token?: string;
  user?: User | null;
};

const authPath = '/auth';

export const authAPI = {
  signIn: async (userName: string, password: string) => {
    const response = await request<AuthSignInData>(`${authPath}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: userName, password }),
    });

    if (!response.data.accessToken && (response.data as { token?: string }).token) {
      response.data.accessToken = (response.data as { token?: string }).token!;
    }

    return response;
  },

  signUp: async (data: SignUpParams & { icon?: File }) => {
    const formData = new FormData();
    formData.append('userName', data.userName);
    formData.append('password', data.password);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('birthDate', data.birthDate);
    formData.append('male', data.male.toString());
    if (data.points !== undefined) {
      formData.append('point', data.points.toString());
    }
    
    // Add icon file if provided
    if (data.icon) {
      formData.append('image', data.icon);
    }

    const response = await request<AuthSignInData>(`${authPath}/register`, {
      method: 'POST',
      headers: {
        // Don't set Content-Type - browser will set it with boundary
      },
      body: formData,
    });

    // Ensure we have the correct response format
    if (!response.data.accessToken && (response.data as any)?.token) {
      response.data.accessToken = (response.data as any).token;
    }

    return response;
  },
};
