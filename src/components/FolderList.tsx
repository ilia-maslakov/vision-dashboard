'use client'
import clsx from 'clsx'

export function FolderList(
    {
        folders,
        onSelectAction,
        selectedId,
    }: {
        folders: any[]
        onSelectAction: (id: string) => void
        selectedId: string | null
    }) {
    return (
        <ul className="space-y-2">
            {folders.map((folder) => (
                <li
                    key={folder.id}
                    className={clsx(
                        'cursor-pointer px-3 py-2 rounded text-sm',
                        folder.id === selectedId ? 'bg-zinc-700 font-semibold' : 'hover:bg-zinc-800'
                    )}
                    onClick={() => onSelectAction(folder.id)}
                >
                    {folder.folder_name}
                </li>
            ))}
        </ul>
    )
}
