import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

beforeAll(() => {
  const style = document.createElement("style");
  style.textContent = `
    * {
      transition-property: none !important;
      animation-duration: 0s !important;
      animation-delay: 0s !important;
    }
  `;
  document.head.appendChild(style);
});

describe("Tooltip component", () => {
  it("renders tooltip content on trigger hover", async () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent data-testid="tooltip-content">
            Tooltip text
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    const trigger = screen.getByText("Hover me");

    // Проверяем что тултипа изначально нет в DOM
    expect(screen.queryByTestId("tooltip-content")).not.toBeInTheDocument();

    // Наводим на триггер
    await userEvent.hover(trigger);

    // Ждем появления тултипа
    const tooltip = await screen.findByTestId("tooltip-content");
    expect(tooltip).toBeVisible();

    // Убираем курсор и ждем пока тултип исчезнет
    await userEvent.unhover(trigger);
  });

  it("applies additional className correctly", async () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent
            className="custom-class"
            data-testid="tooltip-content"
          >
            Content
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    const tooltip = await screen.findByTestId("tooltip-content");
    expect(tooltip).toHaveClass("custom-class");
  });
});
