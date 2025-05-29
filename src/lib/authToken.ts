export const BASE = "https://v1.empr.cloud/api/v1";

let cachedToken: string | null = null;

export function setCachedToken(token: string | null) {
  cachedToken = token;
}

export async function token(): Promise<string> {
  if (cachedToken) return cachedToken;

  const res = await fetch("/api/internal/empr-token", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Unauthorized (EMPR_TOKEN)");

  const data = await res.json();
  cachedToken = data.token;
  return cachedToken;
}
