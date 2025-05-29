import React from "react";
import { render, screen } from "@testing-library/react";

import { ScrollArea } from "./scroll-area";

describe("ScrollArea", () => {
  it("renders children correctly", () => {
    render(
      <ScrollArea style={{ height: 100, width: 100 }}>
        <div data-testid="content">Scroll Content</div>
      </ScrollArea>,
    );
    expect(screen.getByTestId("content")).toHaveTextContent("Scroll Content");
  });

  it("applies additional className", () => {
    const { container } = render(
      <ScrollArea className="custom-class" style={{ height: 100, width: 100 }}>
        <div>Test</div>
      </ScrollArea>,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
