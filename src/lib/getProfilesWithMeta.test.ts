import { beforeEach, describe, expect, it, vi } from "vitest";

import * as authModule from "./authToken";
import { getProfilesWithMeta } from "./getProfilesWithMeta";

describe("getProfilesWithMeta", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("successfully fetches profiles, statuses, and tags", async () => {
    vi.spyOn(authModule, "token").mockResolvedValue("mock-token");

    const mockProfiles = { data: { items: [{ id: "p1" }] } };
    const mockStatuses = { data: [{ id: "s1", status: "active" }] };
    const mockTags = { data: [{ id: "t1", tag_name: "tag1" }] };

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfiles,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatuses,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTags,
      }) as any;

    const result = await getProfilesWithMeta("folder-id");

    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(result).toEqual({
      profiles: mockProfiles.data.items,
      statuses: mockStatuses.data,
      tags: mockTags.data,
    });
  });

  it("throws error if profiles fetch fails", async () => {
    vi.spyOn(authModule, "token").mockResolvedValue("mock-token");

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500 }) // profilesRes fails
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) as any;

    await expect(getProfilesWithMeta("folder-id")).rejects.toThrow(
      "profiles: 500",
    );
  });

  it("throws error if statuses fetch fails", async () => {
    vi.spyOn(authModule, "token").mockResolvedValue("mock-token");

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: false, status: 404 }) // statusesRes fails
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) as any;

    await expect(getProfilesWithMeta("folder-id")).rejects.toThrow(
      "statuses: 404",
    );
  });

  it("throws error if tags fetch fails", async () => {
    vi.spyOn(authModule, "token").mockResolvedValue("mock-token");

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: false, status: 403 }) // tagsRes fails
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) as any;

    await expect(getProfilesWithMeta("folder-id")).rejects.toThrow("tags: 403");
  });
});
