import { token } from "./authToken";
import { ensureProxy } from "./ensureProxy";
import { fetchDefaultProfile } from "./fetchDefaultProfile";

const BASE = "https://v1.empr.cloud/api/v1";

export async function createProfile(
  folderId: string,
  profile: any,
): Promise<string> {
  const defaultProfile = await fetchDefaultProfile();
  const url = `${BASE}/folders/${folderId}/profiles`;
  const body: any = {
    ...defaultProfile,
    profile_name: profile.profile_name,
    profile_notes: profile.profile_notes || "",
    profile_status: profile.profile_status || null,
    profile_tags: profile.profile_tags || [],
  };

  if (profile.proxy) {
    body.proxy_id = await ensureProxy(folderId, profile.proxy);
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-Token": await token(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Ошибка создания профиля: ${res.status} - ${err}`);
  }

  const result = await res.json();
  return result.data.id;
}
