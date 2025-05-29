import * as bcrypt from "bcrypt";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import * as authOptionsModule from "./authOptions";
import { authorize } from "./authorize";

vi.mock("bcrypt", async () => {
  const actual = (await vi.importActual("bcrypt")) as unknown as {
    default: typeof import("bcrypt");
  };
  return {
    __esModule: true,
    default: {
      ...actual.default,
      compare: vi.fn(),
    },
  };
});

const bcryptCompare = (bcrypt as unknown as { default: { compare: Mock } })
  .default.compare;

describe("authorize()", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("возвращает пользователя при валидных данных", async () => {
    vi.spyOn(authOptionsModule, "loadUsers").mockReturnValue([
      { username: "user1", passwordHash: "hashed-password" },
    ]);
    bcryptCompare.mockResolvedValue(true);

    const result = await authorize({ username: "user1", password: "secret" });

    expect(result).toEqual({ id: "user1", name: "user1" });
  });

  it("возвращает null при неверном пароле", async () => {
    vi.spyOn(authOptionsModule, "loadUsers").mockReturnValue([
      { username: "user1", passwordHash: "hashed-password" },
    ]);
    bcryptCompare.mockResolvedValue(false);

    const result = await authorize({ username: "user1", password: "wrong" });

    expect(result).toBeNull();
  });

  it("возвращает null если пользователь не найден", async () => {
    vi.spyOn(authOptionsModule, "loadUsers").mockReturnValue([]);

    const result = await authorize({
      username: "ghost",
      password: "irrelevant",
    });

    expect(result).toBeNull();
  });
});
