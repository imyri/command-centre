export type ApiClientOptions = {
  baseUrl?: string;
};

export class ApiClient {
  private baseUrl: string;

  constructor(opts: ApiClientOptions = {}) {
    const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    this.baseUrl = (opts.baseUrl ?? envUrl ?? "http://localhost:8000").replace(/\/+$/, "");
  }

  async get<T>(path: string, init?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
    const res = await fetch(url, {
      ...init,
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(init?.headers ?? {})
      },
      cache: "no-store"
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`GET ${path} failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
    }

    return (await res.json()) as T;
  }

  async post<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
    const res = await fetch(url, {
      ...init,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(init?.headers ?? {})
      },
      body: JSON.stringify(body),
      cache: "no-store"
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`POST ${path} failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
    }

    return (await res.json()) as T;
  }

  async patch<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
    const res = await fetch(url, {
      ...init,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(init?.headers ?? {})
      },
      body: JSON.stringify(body),
      cache: "no-store"
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`PATCH ${path} failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
    }

    return (await res.json()) as T;
  }

  async delete(path: string, init?: RequestInit): Promise<void> {
    const url = `${this.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
    const res = await fetch(url, {
      ...init,
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...(init?.headers ?? {})
      },
      cache: "no-store"
    });

    if (!res.ok && res.status !== 204) {
      const text = await res.text().catch(() => "");
      throw new Error(`DELETE ${path} failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
    }
  }
}

export const api = new ApiClient();

