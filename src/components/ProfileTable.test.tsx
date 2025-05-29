"use client";

import React, { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Profile } from "@/types/profile";

import { ProfileTable } from "./ProfileTable";

const profilesMock: Profile[] = [
  {
    id: "1",
    email: "user1@example.com",
    os: "apple",
    status: "active",
    tag: "tag1",
    note: "Note 1",
  },
  {
    id: "2",
    email: "user2@example.com",
    os: "android",
    status: "inactive",
    tag: "tag2",
    note: "Note 2",
  },
];

describe("ProfileTable", () => {
  it("renders message when no profiles", () => {
    render(
      <ProfileTable
        profiles={[]}
        selectedIds={[]}
        onSelectionChangeAction={() => {}}
      />,
    );
    expect(
      screen.getByText(/Нет профилей для отображения/i),
    ).toBeInTheDocument();
  });

  it("renders profiles and allows selection toggling", () => {
    function Wrapper() {
      const [selectedIds, setSelectedIds] = useState<string[]>([]);
      return (
        <ProfileTable
          profiles={profilesMock}
          selectedIds={selectedIds}
          onSelectionChangeAction={setSelectedIds}
        />
      );
    }

    render(<Wrapper />);

    expect(screen.getByText("user1@example.com")).toBeInTheDocument();
    expect(screen.getByText("user2@example.com")).toBeInTheDocument();

    const checkboxes = screen.getAllByRole("checkbox");
    const firstCheckbox = checkboxes[1];

    fireEvent.click(firstCheckbox);
    expect(firstCheckbox).toBeChecked();
  });

  it("toggles select all checkbox", () => {
    function Wrapper() {
      const [selectedIds, setSelectedIds] = useState<string[]>([]);
      return (
        <ProfileTable
          profiles={profilesMock}
          selectedIds={selectedIds}
          onSelectionChangeAction={setSelectedIds}
        />
      );
    }

    render(<Wrapper />);

    const checkboxes = screen.getAllByRole("checkbox");
    const selectAllCheckbox = checkboxes[0];

    fireEvent.click(selectAllCheckbox);
    expect(selectAllCheckbox).toBeChecked();

    fireEvent.click(selectAllCheckbox);
    expect(selectAllCheckbox).not.toBeChecked();
  });

  it("sorts by email and toggles sort direction", () => {
    function Wrapper() {
      const [selectedIds, setSelectedIds] = useState<string[]>([]);
      return (
        <ProfileTable
          profiles={profilesMock}
          selectedIds={selectedIds}
          onSelectionChangeAction={setSelectedIds}
        />
      );
    }

    render(<Wrapper />);

    const emailHeader = screen.getByText("Имя");
    const sortIcon = () =>
      screen.getByText("Имя").parentElement?.querySelector("svg");

    // Изначально — сортировка по email ASC (ChevronUp)
    expect(sortIcon()).toBeInTheDocument();

    // Клик => сортировка по email DESC (ChevronDown)
    fireEvent.click(emailHeader);
    expect(sortIcon()).toBeInTheDocument();

    // Клик по другой колонке => сортировка по другой и icon исчезает
    const tagHeader = screen.getByText("Теги");
    fireEvent.click(tagHeader);

    // icon у email должен исчезнуть
    expect(sortIcon()).not.toBeInTheDocument();
  });
});
