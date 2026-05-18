const API_BASE = import.meta.env.VITE_API_URL || "/api/v1";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoginResponse {
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: string;
  };
  token: string;
}

export const getAuthToken = (): string | null => localStorage.getItem("auth_token");

export const setAuthToken = (token: string): void => {
  localStorage.setItem("auth_token", token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_data");
};

export const getUserData = (): Record<string, unknown> | null => {
  const userData = localStorage.getItem("user_data");
  return userData ? JSON.parse(userData) : null;
};

export const setUserData = (user: unknown): void => {
  localStorage.setItem("user_data", JSON.stringify(user));
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = (await response.json()) as ApiResponse<T>;

    if (!response.ok) {
      const errorMessage = data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage) as Error & { status?: number; response?: ApiResponse<T> };
      error.status = response.status;
      error.response = data;
      throw error;
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error && error.message) {
      const status = (error as Error & { status?: number }).status;
      if (status !== 404) {
        console.error("API Error:", error.message);
      }
      throw error;
    }
    console.error("API Error:", error);
    throw new Error("Network error. Please check your connection and try again.");
  }
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.data) {
      setAuthToken(response.data.token);
      setUserData(response.data.user);
    }

    return response.data!;
  },

  register: async (
    username: string,
    email: string,
    password: string,
    fullName: string,
    role: string = "editor"
  ): Promise<LoginResponse> => {
    const response = await apiRequest<LoginResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password, fullName, role }),
    });

    if (response.data) {
      setAuthToken(response.data.token);
      setUserData(response.data.user);
    }

    return response.data!;
  },

  me: async (): Promise<unknown> => {
    const response = await apiRequest("/auth/me", { method: "GET" });
    return response.data;
  },

  logout: (): void => {
    removeAuthToken();
  },
};

export const api = {
  get: <T>(endpoint: string): Promise<ApiResponse<T>> =>
    apiRequest<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> =>
    apiRequest<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> =>
    apiRequest<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> =>
    apiRequest<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string): Promise<ApiResponse<T>> =>
    apiRequest<T>(endpoint, { method: "DELETE" }),
};

export default api;
