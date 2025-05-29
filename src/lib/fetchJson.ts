import { token } from "./authToken";

export async function fetchJson(url: string, options: RequestInit = {}) {
  const headers = {
    "X-Token": await token(),
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Ошибка ${url}: ${res.status} - ${err}`);
  }

  return res.json();
}
