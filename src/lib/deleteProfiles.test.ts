import { beforeEach, describe, expect, it, vi } from "vitest";

import * as authModule from "./authToken";
import { deleteProfiles } from "./deleteProfiles";

describe("deleteProfiles", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("sends DELETE requests for each id", async () => {
    vi.spyOn(authModule, "token").mockResolvedValue("mock-token");
    const mockFetch = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
    } as any);

    const folderId = "folder-123";
    const ids = ["id1", "id2"];

    await deleteProfiles(folderId, ids);

    expect(mockFetch).toHaveBeenCalledTimes(ids.length);
    expect(mockFetch).toHaveBeenCalledWith(
      `${authModule.BASE}/folders/${folderId}/profiles/id1`,
      expect.objectContaining({
        method: "DELETE",
        headers: { "X-Token": "mock-token" },
      }),
    );
    expect(mockFetch).toHaveBeenCalledWith(
      `${authModule.BASE}/folders/${folderId}/profiles/id2`,
      expect.objectContaining({
        method: "DELETE",
        headers: { "X-Token": "mock-token" },
      }),
    );
  });

  it("logs warning if response is not ok", async () => {
    vi.spyOn(authModule, "token").mockResolvedValue("mock-token");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
    } as any);

    const folderId = "folder-123";
    const ids = ["id1"];

    await deleteProfiles(folderId, ids);

    expect(warnSpy).toHaveBeenCalledWith("Не удалось удалить профиль id1: 500");
  });
});
