// src/app/login/LoginPage.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import LoginPage from "./page";

// 🛠 глобальный мок push
const push = vi.fn();

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  __esModule: true,
}));

import { signIn } from "next-auth/react";

describe("LoginPage", () => {
  const mockedSignIn = signIn as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("показывает ошибку при неверных данных", async () => {
    mockedSignIn.mockResolvedValueOnce({ ok: false });
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "user1" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrong pass" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/неверный логин или пароль/i),
      ).toBeInTheDocument(),
    );
  });

  it("перенаправляет при успешном логине", async () => {
    mockedSignIn.mockResolvedValueOnce({ ok: true });
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "secret" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/");
    });
  });

  it("вызывает signIn с правильными параметрами", async () => {
    mockedSignIn.mockResolvedValueOnce({ ok: true });
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "abc" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "xyz" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith("credentials", {
        username: "abc",
        password: "xyz",
        redirect: false,
      });
    });
  });
});
