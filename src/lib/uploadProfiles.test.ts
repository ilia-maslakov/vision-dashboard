import { beforeEach, describe, expect, it, vi } from "vitest";

import * as createProfileModule from "./createProfile";
import * as uploadCookiesModule from "./uploadCookies";
import * as uploadProfilesModule from "./uploadProfiles";

describe("uploadProfiles", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("calls createProfile and uploadCookies correctly and returns { status: 'ok' }", async () => {
    const folderId = "folder-id";
    const profiles = [
      {
        profile_name: "test-profile",
        cookie: [{ name: "cookie1", value: "value1" }],
      },
      {
        profile_name: "profile-no-cookie",
      },
    ];

    const createProfileMock = vi
      .spyOn(createProfileModule, "createProfile")
      .mockResolvedValue("profile-id");
    const uploadCookiesMock = vi
      .spyOn(uploadCookiesModule, "uploadCookies")
      .mockResolvedValue(undefined);

    const result = await uploadProfilesModule.uploadProfiles(
      folderId,
      profiles,
    );

    // Проверяем, что createProfile вызван 2 раза с нужными аргументами
    expect(createProfileMock).toHaveBeenCalledTimes(2);
    expect(createProfileMock).toHaveBeenCalledWith(folderId, profiles[0]);
    expect(createProfileMock).toHaveBeenCalledWith(folderId, profiles[1]);

    // Проверяем, что uploadCookies вызван только для первого профиля, где есть cookie
    expect(uploadCookiesMock).toHaveBeenCalledTimes(1);
    expect(uploadCookiesMock).toHaveBeenCalledWith(
      folderId,
      "profile-id",
      profiles[0].cookie,
    );

    // Проверяем, что функция возвращает ожидаемый объект
    expect(result).toEqual({ status: "ok" });
  });

  it("catches errors and logs them without throwing", async () => {
    const folderId = "folder-id";
    const profiles = [
      {
        profile_name: "bad-profile",
        cookie: [{ name: "cookie1", value: "value1" }],
      },
    ];

    const createProfileMock = vi
      .spyOn(createProfileModule, "createProfile")
      .mockRejectedValue(new Error("createProfile failed"));
    const uploadCookiesMock = vi
      .spyOn(uploadCookiesModule, "uploadCookies")
      .mockResolvedValue(undefined);

    const consoleErrorMock = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const result = await uploadProfilesModule.uploadProfiles(
      folderId,
      profiles,
    );

    expect(createProfileMock).toHaveBeenCalled();
    expect(uploadCookiesMock).not.toHaveBeenCalled();
    expect(consoleErrorMock).toHaveBeenCalledWith(
      `Ошибка обработки профиля ${profiles[0].profile_name}:`,
      "createProfile failed",
    );

    expect(result).toEqual({ status: "ok" });

    consoleErrorMock.mockRestore();
  });
});
