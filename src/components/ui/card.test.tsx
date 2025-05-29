import React from "react";
import { render, screen } from "@testing-library/react";

import { Card, CardContent } from "./card";

describe("Card components", () => {
  it("renders Card with correct classes and props", () => {
    render(
      <Card data-testid="card" className="custom-class" aria-label="card" />,
    );
    const card = screen.getByTestId("card");

    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("rounded-xl border bg-white text-black shadow-sm");
    expect(card).toHaveClass("custom-class");
    expect(card).toHaveAttribute("aria-label", "card");
  });

  it("renders CardContent with correct classes and props", () => {
    render(
      <CardContent
        data-testid="content"
        className="content-class"
        aria-hidden="true"
      />,
    );
    const content = screen.getByTestId("content");

    expect(content).toBeInTheDocument();
    expect(content).toHaveClass("p-4");
    expect(content).toHaveClass("content-class");
    expect(content).toHaveAttribute("aria-hidden", "true");
  });
});
