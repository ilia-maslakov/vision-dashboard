import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import RootLayout from "@/app/layout";

// Мокаем SessionProvider
vi.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="session-provider">{children}</div>
  ),
}));

describe("RootLayout", () => {
  it("renders children inside SessionProvider and layout structure", () => {
    const { container } = render(
      // jsdom не может вставить html → оборачиваем div
      <div id="test-wrapper">
        <RootLayout>
          <div>Тестовый контент</div>
        </RootLayout>
      </div>,
    );

    expect(screen.getByText("Тестовый контент")).toBeInTheDocument();
    expect(container.querySelector("html")).toBeInTheDocument();
    expect(container.querySelector("body")).toBeInTheDocument();
    expect(container.querySelector("main")).toBeInTheDocument();
  });
});
