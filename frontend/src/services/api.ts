const API_BASE_URL = 'http://localhost:5000/api';

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: {
      id: string;
      userName: string;
      firstName: string;
      lastName: string;
      email: string;
      birthDate: string;
      male: boolean;
      points: number;
      iconUrl: string;
      role: string;
    };
  };
}

export interface DefaultItem {
  _id: string;
  name: string;
  pointToTrade: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomItem {
  _id: string;
  name: string;
  pointToTrade: number;
  imageUrl: string;
  userId: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TradeHistory {
  _id: string;
  userId: string;
  itemId: string;
  itemName?: string;
  quantity?: number;
  quantityTraded?: number;
  pointsSpent?: number;
  pointsUsed?: number;
  prevPoint?: number;
  remainPoint?: number;
  status?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth APIs
export const authAPI = {
  signUp: async (data: {
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    male: boolean;
  }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  signIn: async (userName: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, password }),
    });
    return response.json();
  },

  refreshToken: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  signOut: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/sign-out`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

// Default Items APIs
export const defaultItemsAPI = {
  getAll: async (): Promise<{ message: string; data: DefaultItem[] }> => {
    const response = await fetch(`${API_BASE_URL}/default-items`);
    return response.json();
  },

  getById: async (id: string): Promise<{ message: string; data: DefaultItem }> => {
    const response = await fetch(`${API_BASE_URL}/default-items/${id}`);
    return response.json();
  },

  create: async (token: string, data: Omit<DefaultItem, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch(`${API_BASE_URL}/default-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (token: string, id: string, data: Partial<DefaultItem>) => {
    const response = await fetch(`${API_BASE_URL}/default-items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (token: string, id: string) => {
    const response = await fetch(`${API_BASE_URL}/default-items/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

// Custom Items APIs
export const customItemsAPI = {
  getAll: async (token: string): Promise<{ message: string; data: CustomItem[] }> => {
    const response = await fetch(`${API_BASE_URL}/custom-items`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getById: async (token: string, id: string): Promise<{ message: string; data: CustomItem }> => {
    const response = await fetch(`${API_BASE_URL}/custom-items/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  create: async (token: string, data: Omit<CustomItem, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch(`${API_BASE_URL}/custom-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (token: string, id: string, data: Partial<CustomItem>) => {
    const response = await fetch(`${API_BASE_URL}/custom-items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (token: string, id: string) => {
    const response = await fetch(`${API_BASE_URL}/custom-items/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

// Trade Histories APIs
export const tradeHistoriesAPI = {
  getAll: async (token: string): Promise<{ message: string; data: TradeHistory[] }> => {
    const response = await fetch(`${API_BASE_URL}/trade-histories`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getById: async (token: string, id: string): Promise<{ message: string; data: TradeHistory }> => {
    const response = await fetch(`${API_BASE_URL}/trade-histories/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  create: async (token: string, data: Omit<TradeHistory, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch(`${API_BASE_URL}/trade-histories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (token: string, id: string, data: Partial<TradeHistory>) => {
    const response = await fetch(`${API_BASE_URL}/trade-histories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (token: string, id: string) => {
    const response = await fetch(`${API_BASE_URL}/trade-histories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};
// Users APIs
export const usersAPI = {
  getAll: async (token: string): Promise<{ message: string; data: any[] }> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  getById: async (token: string, id: string): Promise<{ message: string; data: any }> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  update: async (token: string, id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (token: string, id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};