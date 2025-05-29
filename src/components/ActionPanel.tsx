"use client";

import { Download, Trash2, UploadCloud } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionPanelProps {
  selectedCount: number;
  onDeleteAction?: () => void;
  onUploadAction?: () => void;
  onDownloadAction?: () => void;
}

export function ActionPanel({
  selectedCount,
  onDeleteAction,
  onUploadAction,
  onDownloadAction,
}: ActionPanelProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-bold text-sm text-zinc-400 border border-zinc-700 rounded-md px-2 py-0.5">
        {selectedCount}
      </span>
      <div className="flex sticky z-1 rounded-3xl border-zinc-700 bg-[#1a1c23] px-6 py-3 justify-end items-center gap-10 text-white">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onUploadAction}
                className="hover:text-green-400 transition"
                aria-label="Загрузить"
              >
                <UploadCloud className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Загрузить</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onDownloadAction}
                className="hover:text-blue-400 transition"
                aria-label="Скачать"
              >
                <Download className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Скачать</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onDeleteAction}
                disabled={selectedCount === 0}
                className={`transition ${
                  selectedCount === 0
                    ? "text-zinc-600 cursor-not-allowed"
                    : "hover:text-red-500 text-white"
                }`}
                aria-label="Удалить"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Удалить</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
