import ky from 'ky';

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export let client = ky.create({
  prefixUrl: BASE,
  headers: { 'content-type': 'application/json' },
  throwHttpErrors: false,
});

export function setAuthToken(token?: string) {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  client = ky.create({ prefixUrl: BASE, headers, throwHttpErrors: false });
}

export async function get<T = unknown>(path: string) {
  const res = await client.get(path);
  const data = await res.json();
  return data as T;
}
