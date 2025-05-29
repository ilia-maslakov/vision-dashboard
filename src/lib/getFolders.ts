import { BASE, token } from "./authToken";

export async function getFolders() {
  const headers = { "X-Token": await token() };

  const res = await fetch(`${BASE}/folders`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Cannot load folders");
  const json = await res.json();
  const filtered = (json.data || []).filter(
    (folder: any) => !folder.deleted_at,
  );
  return { data: filtered };
}
