import { BASE, token } from "./authToken";

export async function uploadCookies(
  folderId: string,
  profileId: string,
  cookies: any[],
) {
  const importUrl = `${BASE}/cookies/import/${folderId}/${profileId}`;
  const res = await fetch(importUrl, {
    method: "POST",
    headers: {
      "X-Token": await token(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cookies }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Ошибка загрузки куков: ${res.status} - ${msg}`);
  }
}
