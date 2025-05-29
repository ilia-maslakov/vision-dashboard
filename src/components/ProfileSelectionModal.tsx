import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { ProfileDescription } from "@/types/profileDescription";

interface ProfileSelectionModalProps {
  profiles: ProfileDescription[];
  onConfirm: (selectedNames: string[]) => void;
  onCancel: () => void;
}

export function ProfileSelectionModal({
  profiles,
  onConfirm,
  onCancel,
}: ProfileSelectionModalProps) {
  const [selected, setSelected] = useState<string[]>(
    profiles.map((p) => p.name),
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const allSelected = selected.length === profiles.length;
  const toggleAll = () => {
    setSelected(allSelected ? [] : profiles.map((p) => p.name));
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-900 text-black dark:text-white p-6 rounded-md shadow-md w-[700px] max-h-[80vh] flex flex-col">
        <h2 className="text-lg font-bold mb-4">
          Выберите профили для загрузки ({selected.length}/{profiles.length})
        </h2>
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-zinc-700">
                <th className="px-2 py-1">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    title={allSelected ? "Снять все" : "Выбрать все"}
                  />
                </th>
                <th className="px-2 py-1">Email</th>
                <th className="px-2 py-1">Статус</th>
                <th className="px-2 py-1">Тег</th>
                <th className="px-2 py-1">Заметка</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr
                  key={p.name}
                  className="border-t border-zinc-800 hover:bg-zinc-800/40"
                >
                  <td className="px-2 py-1">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.name)}
                      onChange={() => toggle(p.name)}
                    />
                  </td>
                  <td className="px-2 py-1 font-mono">{p.name}</td>
                  <td className="px-2 py-1 text-red-900">{p.status}</td>
                  <td className="px-2 py-1 text-green-600">{p.tag || "—"}</td>
                  <td className="px-2 py-1 text-gray-950">{p.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-zinc-700">
          <button
            onClick={onCancel}
            className="px-4 py-1 text-sm bg-zinc-700 hover:bg-zinc-600 text-white rounded"
          >
            Отмена
          </button>
          <button
            onClick={() => onConfirm(selected)}
            className="px-4 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Загрузить
          </button>
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
