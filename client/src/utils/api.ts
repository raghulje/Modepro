const API_BASE = import.meta.env.VITE_API_URL || "/api";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

async function parseJson<T>(res: Response): Promise<ApiResponse<T>> {
  const data = (await res.json()) as ApiResponse<T>;
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export const api = {
  async post<T = unknown>(path: string, body: unknown): Promise<ApiResponse<T>> {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return parseJson<T>(res);
  },

  async get<T = unknown>(path: string): Promise<ApiResponse<T>> {
    const res = await fetch(`${API_BASE}${path}`);
    return parseJson<T>(res);
  },
};
