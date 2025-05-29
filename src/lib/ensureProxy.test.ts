import { beforeEach, describe, expect, it, vi } from "vitest";

import { ensureProxy } from "./ensureProxy";
import * as fetchJsonModule from "./fetchJson";

vi.mock("./fetchJson", () => ({
  fetchJson: vi.fn(),
}));

describe("ensureProxy", () => {
  const folderId = "folder-123";
  const proxy = {
    proxy_name: "my-proxy",
    proxy_type: "HTTP",
    proxy_ip: "1.2.3.4",
    proxy_port: "8080",
    proxy_username: "user",
    proxy_password: "pass",
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns existing proxy ID if found", async () => {
    vi.spyOn(fetchJsonModule, "fetchJson").mockResolvedValueOnce({
      data: {
        items: [
          {
            id: "proxy-id-1",
            proxy_ip: "1.2.3.4",
            proxy_port: "8080",
            proxy_username: "user",
            proxy_password: "pass",
          },
        ],
      },
    });

    const result = await ensureProxy(folderId, proxy);
    expect(result).toBe("proxy-id-1");
  });

  it("creates new proxy and returns its ID if not found", async () => {
    vi.spyOn(fetchJsonModule, "fetchJson")
      .mockResolvedValueOnce({ data: { items: [] } }) // first call: list
      .mockResolvedValueOnce({ data: [{ id: "new-proxy-id" }] }); // second call: create

    const result = await ensureProxy(folderId, proxy);
    expect(result).toBe("new-proxy-id");
  });
});
