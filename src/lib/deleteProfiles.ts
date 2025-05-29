import { BASE, token } from "./authToken";

export async function deleteProfiles(
  folderId: string,
  ids: string[],
): Promise<void> {
  const headers = { "X-Token": await token() };

  for (const id of ids) {
    const res = await fetch(`${BASE}/folders/${folderId}/profiles/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) {
      console.warn(`Не удалось удалить профиль ${id}: ${res.status}`);
    }
  }
}
