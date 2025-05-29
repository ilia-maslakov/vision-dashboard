import { beforeEach, describe, expect, it, vi } from "vitest";

import * as authModule from "./authToken";

describe("auth", () => {
  beforeEach(() => {
    authModule.setCachedToken(null);
    vi.resetAllMocks();
  });

  it("returns cached token if already set", async () => {
    authModule.setCachedToken("cached-token");

    global.fetch = vi.fn(() => {
      throw new Error("fetch не должен быть вызван");
    }) as any;

    const result = await authModule.token();
    expect(result).toBe("cached-token");
  });

  it("fetches token if not cached", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "test-token" }),
    }) as any;

    const result = await authModule.token();
    expect(result).toBe("test-token");
  });

  it("throws if token fetch fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false }) as any;

    await expect(authModule.token()).rejects.toThrow(
      "Unauthorized (EMPR_TOKEN)",
    );
  });
});
