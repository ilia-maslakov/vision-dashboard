"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Profile } from "@/types/profile";

interface ProfileTableProps {
  profiles: Profile[];
  selectedIds: string[];
  onSelectionChangeAction: (ids: string[]) => void;
}

type SortKey = "email" | "status" | "note" | "tag";
type SortOrder = "asc" | "desc";

export function ProfileTable({
  profiles = [],
  selectedIds,
  onSelectionChangeAction,
}: ProfileTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("email");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const toggle = (id: string) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    onSelectionChangeAction(updated);
  };

  const toggleAll = () => {
    const updated =
      selectedIds.length === profiles.length ? [] : profiles.map((p) => p.id);
    onSelectionChangeAction(updated);
  };

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedProfiles = [...profiles].sort((a, b) => {
    const aVal = a[sortKey]?.toLowerCase() ?? "";
    const bVal = b[sortKey]?.toLowerCase() ?? "";
    return sortOrder === "asc"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  const SortIcon = (key: SortKey) => {
    const visible = sortKey === key;
    const Icon = sortOrder === "asc" ? ChevronUp : ChevronDown;
    return (
      <span className="inline-block w-[16px] text-zinc-400">
        {visible ? <Icon size={14} /> : null}
      </span>
    );
  };

  if (profiles.length === 0) {
    return (
      <div className="p-4 text-center text-zinc-400">
        Нет профилей для отображения
      </div>
    );
  }

  return (
    <ScrollArea className="w-full h-full overflow-y-auto">
      <table className="w-full text-sm text-white">
        <thead className="bg-[#1c1f2b] text-left text-xs uppercase">
          <tr>
            <th className="px-3 py-4 w-8">
              <Checkbox
                checked={selectedIds.length === profiles.length}
                onCheckedChange={toggleAll}
              />
            </th>
            {(["email", "status", "tag", "note"] as SortKey[]).map((key) => (
              <th
                key={key}
                className="group px-3 py-2 cursor-pointer whitespace-nowrap"
                onClick={() => toggleSort(key)}
              >
                <div className="flex items-center gap-1 border-r border-zinc-600 pr-3">
                  <span className="group-hover:text-white text-zinc-400 transition-colors text-base duration-200 capitalize">
                    {key === "email"
                      ? "Имя"
                      : key === "note"
                        ? "Заметки"
                        : key === "tag"
                          ? "Теги"
                          : "Статус"}
                  </span>
                  {SortIcon(key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedProfiles.map((profile) => (
            <tr
              key={profile.id}
              className="border-b border-zinc-700 bg-[#2a2f40] hover:bg-[#34394f] transition"
            >
              <td className="px-3 py-2">
                <Checkbox
                  checked={selectedIds.includes(profile.id)}
                  onCheckedChange={() => toggle(profile.id)}
                />
              </td>
              <td className="px-3 py-2 flex items-center gap-2">
                <span className="max-w-[200px]">{profile.email}</span>
              </td>
              <td className="px-3 py-2">
                <Badge className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border border-pink-600 text-pink-600">
                  {profile.status}
                </Badge>
              </td>
              <td className="px-3 py-2">
                {profile.tag && (
                  <Badge
                    variant="outline"
                    className="text-xs border border-green-400 rounded-md text-green-400"
                  >
                    {profile.tag}
                  </Badge>
                )}
              </td>
              <td className="px-3 py-2 text-left">
                {profile.note && (
                  <div className="inline-flex gap-2 border-l-4 border-yellow-500 bg-[#3a3f40] text-white px-3 py-1 text-xs">
                    {profile.note}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}
