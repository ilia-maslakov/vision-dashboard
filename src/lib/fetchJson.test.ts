// src/lib/fetchJson.test.ts
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as authModule from "./authToken";
import { fetchJson } from "./fetchJson";

describe("fetchJson", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("fetches JSON successfully with default headers", async () => {
    vi.spyOn(authModule, "token").mockResolvedValue("mock-token");

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: "success" }),
    }) as any;

    const result = await fetchJson("https://example.com/api/data");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.com/api/data",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Token": "mock-token",
          "Content-Type": "application/json",
        }),
      }),
    );
    expect(result).toEqual({ data: "success" });
  });

  it("merges additional headers correctly", async () => {
    vi.spyOn(authModule, "token").mockResolvedValue("mock-token");

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ merged: true }),
    }) as any;

    const extraHeaders = { "X-Custom-Header": "value" };
    const result = await fetchJson("https://example.com/api/data", {
      headers: extraHeaders,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.com/api/data",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Token": "mock-token",
          "Content-Type": "application/json",
          "X-Custom-Header": "value",
        }),
      }),
    );
    expect(result).toEqual({ merged: true });
  });

  it("throws error when response is not ok", async () => {
    vi.spyOn(authModule, "token").mockResolvedValue("mock-token");

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => "Not Found",
    }) as any;

    await expect(fetchJson("https://example.com/api/fail")).rejects.toThrow(
      "Ошибка https://example.com/api/fail: 404 - Not Found",
    );
  });
});
