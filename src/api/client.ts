const BASE = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'yeldify-token';
const DEV_USER_ID = 'user-123';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // localStorage indisponível (SSR/privacy mode) — segue sem persistência
  }
}

function buildUrl(path: string, params?: object): string {
  const url = new URL(`${BASE}${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT';
  body?: unknown;
  params?: object;
  auth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params, auth = true } = options;
  const token = getToken();

  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const searchParams: Record<string, unknown> = { ...(params as Record<string, unknown>) };
  if (auth && !token) searchParams.user_id = DEV_USER_ID;

  const res = await fetch(buildUrl(path, searchParams), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const json = await res.json();
      detail = json?.detail?.message ?? json?.detail ?? detail;
    } catch {
      // corpo não-JSON — mantém statusText
    }
    throw new ApiError(res.status, String(detail));
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const http = {
  get: <T>(path: string, params?: object) =>
    request<T>(path, { method: 'GET', params }),
  post: <T>(path: string, body?: unknown, params?: object) =>
    request<T>(path, { method: 'POST', body, params }),
  patch: <T>(path: string, body?: unknown, params?: object) =>
    request<T>(path, { method: 'PATCH', body, params }),
  put: <T>(path: string, body?: unknown, params?: object) =>
    request<T>(path, { method: 'PUT', body, params }),
};