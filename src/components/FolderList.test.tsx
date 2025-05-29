import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { FolderList } from "./FolderList";

describe("FolderList", () => {
  const foldersMock = [
    { id: "1", folder_name: "Folder 1" },
    { id: "2", folder_name: "Folder 2" },
  ];

  it("renders list of folders", () => {
    render(
      <FolderList
        folders={foldersMock}
        onSelectAction={() => {}}
        selectedId={null}
      />,
    );
    expect(screen.getByText("Folder 1")).toBeInTheDocument();
    expect(screen.getByText("Folder 2")).toBeInTheDocument();
  });

  it("applies selected style to selected folder", () => {
    render(
      <FolderList
        folders={foldersMock}
        onSelectAction={() => {}}
        selectedId="2"
      />,
    );
    const selectedItem = screen.getByText("Folder 2");
    expect(selectedItem).toHaveClass("bg-zinc-700");
    expect(selectedItem).toHaveClass("font-semibold");
  });

  it("calls onSelectAction when a folder is clicked", () => {
    const onSelectActionMock = vi.fn();
    render(
      <FolderList
        folders={foldersMock}
        onSelectAction={onSelectActionMock}
        selectedId={null}
      />,
    );
    const folderItem = screen.getByText("Folder 1");
    fireEvent.click(folderItem);
    expect(onSelectActionMock).toHaveBeenCalledWith("1");
  });
});
