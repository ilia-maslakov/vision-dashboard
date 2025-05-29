import { describe, expect, it, vi } from "vitest";

import * as profilesModule from "@/lib/getProfilesWithMeta";
import { getProfileDescriptionsFromRaw } from "@/lib/profileUtils";

describe("getProfileDescriptionsFromRaw", () => {
  it("correctly maps raw profiles to descriptions", async () => {
    // Мокаем getProfilesWithMeta, чтобы вернуть тестовые статусы и теги
    vi.spyOn(profilesModule, "getProfilesWithMeta").mockResolvedValue({
      statuses: [
        { id: "status1", status: "Active" },
        { id: "status2", status: "Inactive" },
      ],
      tags: [
        { id: "tag1", tag_name: "Tag One" },
        { id: "tag2", tag_name: "Tag Two" },
      ],
      profiles: [], // не используется здесь
    });

    const folderId = "folder123";
    const rawProfiles = [
      {
        profile_name: "John Doe",
        profile_status: "status1",
        profile_tags: ["tag1", "tagX"], // 'tagX' отсутствует в tagMap
        profile_notes: "<p>Some notes</p>",
      },
      {
        profile_name: "",
        profile_status: "unknown_status",
        profile_tags: [],
        profile_notes: "",
      },
    ];

    const descriptions = await getProfileDescriptionsFromRaw(
      folderId,
      rawProfiles,
    );

    expect(descriptions).toEqual([
      {
        name: "John Doe",
        status: "Active",
        tag: "Tag One, tagX",
        note: "Some notes",
      },
      {
        name: "—",
        status: "unknown_status",
        tag: undefined,
        note: undefined,
      },
    ]);
  });
});
