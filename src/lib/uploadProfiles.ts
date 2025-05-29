import { createProfile } from "./createProfile";
import { uploadCookies } from "./uploadCookies";

export async function uploadProfiles(folderId: string, profiles: any[]) {
  for (const profile of profiles) {
    try {
      const profileId = await createProfile(folderId, profile);
      if (profile.cookie?.length) {
        await uploadCookies(folderId, profileId, profile.cookie);
      }
    } catch (e: any) {
      console.error(
        `Ошибка обработки профиля ${profile.profile_name}:`,
        e.message,
      );
    }
  }

  return { status: "ok" };
}
