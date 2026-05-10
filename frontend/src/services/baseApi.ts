const API_BASE_URL = import.meta.env.VITE_API_URL ?? `http://localhost:${import.meta.env.VITE_API_PORT ?? 3000}`;
const API_PREFIX = "/api";

export interface ApiResponse<T = unknown> {
  state: number;
  data: T;
  message?: string;
  error?: string;
}

const buildUrl = (path: string) => `${API_BASE_URL}${API_PREFIX}${path}`;

export const authHeader = (token?: string): Record<string, string> => {
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
};

export async function request<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(buildUrl(path), {
    credentials: "include",
    ...options,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const message = data?.message || response.statusText || "Request failed";
    throw new Error(message);
  }

  return data as ApiResponse<T>;
}
