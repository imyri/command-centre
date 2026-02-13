import { getCookie } from "cookies-next";

type ApiClientOptions = {
  baseUrl?: string;
  headers?: Record<string, string>;
};

export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(opts: ApiClientOptions = {}) {
    const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    // The fix: clearly using one set of quotes for your IP
    this.baseUrl = (opts.baseUrl ?? envUrl ?? "http://192.168.1.56:8000").replace(/\/+$/, "");
    this.headers = opts.headers ?? {};
  }

  async get<T>(path: string, init?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...init, method: "GET" });
  }

  async post<T>(path: string, body?: any, init?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...init,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T>(path: string, body?: any, init?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...init,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(path: string, init?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...init, method: "DELETE" });
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
    
    const headers = {
      "Content-Type": "application/json",
      ...this.headers,
      ...init.headers,
    };

    const response = await fetch(url, { ...init, headers });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(errorBody || response.statusText);
    }

    if (response.status === 204) return {} as T;
    return response.json();
  }
}

export const api = new ApiClient();