import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("renders with default variant and base classes", () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole("button", { name: "Click me" });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass("bg-white");
    expect(btn).toHaveClass("text-black");
  });

  it("renders with destructive variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    const btn = screen.getByRole("button", { name: "Delete" });
    expect(btn).toHaveClass("bg-red-600");
    expect(btn).toHaveClass("text-white");
  });

  it("renders with outline variant classes", () => {
    render(<Button variant="outline">Outline</Button>);
    const btn = screen.getByRole("button", { name: "Outline" });
    expect(btn).toHaveClass("border-white");
    expect(btn).toHaveClass("bg-transparent");
  });

  it("accepts additional className prop", () => {
    render(<Button className="custom-class">Test</Button>);
    const btn = screen.getByRole("button", { name: "Test" });
    expect(btn).toHaveClass("custom-class");
  });

  it("forwards ref to the button element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe("Ref Button");
  });

  it("handles click events", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    const btn = screen.getByRole("button", { name: "Click" });
    await user.click(btn);
    expect(onClick).toHaveBeenCalled();
  });
});
