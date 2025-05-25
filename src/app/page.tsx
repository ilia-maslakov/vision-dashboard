'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { deleteProfiles, getFolders, getProfilesWithMeta, uploadProfiles } from '@/lib/emprClient'
import { FolderList } from '@/components/FolderList'
import { ProfileTable } from '@/components/ProfileTable'
import { ActionPanel } from '@/components/ActionPanel'
import { ProfileUploadDialog, ProfileUploadDialogRef } from '@/components/ProfileUploadDialog'

function cleanProfiles(profiles: any[], statuses: any[], tags: any[]) {
    const statusMap = Object.fromEntries(statuses.map((s: any) => [s.id, s.status]))
    const tagMap = Object.fromEntries(tags.map((t: any) => [t.id, t.tag_name]))

    return profiles.map((p: any) => ({
        id: p.id,
        email: p.profile_name || '—',
        os: 'apple',
        status: statusMap[p.profile_status] || '—',
        tag: (p.profile_tags || []).map((id: string) => tagMap[id] || id).join(', '),
        note: p.profile_notes?.replace(/<[^>]*>?/gm, '').trim() || '',
    }))
}

export default function HomePage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [folders, setFolders] = useState<any[]>([])
    const [profiles, setProfiles] = useState<any[]>([])
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const dialogRef = useRef<ProfileUploadDialogRef>(null)

    useEffect(() => {
        if (status === 'unauthenticated') router.replace('/login')
    }, [status, router])

    useEffect(() => {
        if (status === 'authenticated') {
            getFolders().then(({ data }) => setFolders(data))
        }
    }, [status])

    useEffect(() => {
        if (!selectedFolderId) return

        getProfilesWithMeta(selectedFolderId).then(({ profiles, statuses, tags }) => {
            setProfiles(cleanProfiles(profiles, statuses, tags))
        })
    }, [selectedFolderId])

    if (status !== 'authenticated') return null

    const handleDownload = async () => {
        if (!selectedFolderId) return

        const defaultFileName = `profiles-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.json`
        const name = prompt('Введите имя файла для сохранения:', defaultFileName)

        if (!name) return

        const res = await fetch(`/api/export?folderId=${selectedFolderId}`)
        if (!res.ok) {
            alert('Ошибка при получении файла')
            return
        }

        const blob = await res.blob()
        const blobUrl = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = blobUrl
        a.download = name.endsWith('.json') ? name : `${name}.json`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(blobUrl)
    }

    const handleDelete = async () => {
        if (!selectedFolderId || selectedIds.length === 0) return
        setSelectedIds([])

        await deleteProfiles(selectedFolderId, selectedIds)
        const { profiles, statuses, tags } = await getProfilesWithMeta(selectedFolderId)
        setProfiles(cleanProfiles(profiles, statuses, tags))
    }

    const handleUpload = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'application/json'
        input.onchange = () => {
            const file = input.files?.[0]
            if (file && dialogRef.current) {
                dialogRef.current.handleFile(file)
            }
        }
        input.click()
    }

    const handleProfilesSelected = async (profilesToUpload: any[]) => {
        if (!selectedFolderId) return
        await uploadProfiles(selectedFolderId, profilesToUpload)

        const { profiles, statuses, tags } = await getProfilesWithMeta(selectedFolderId)
        setProfiles(cleanProfiles(profiles, statuses, tags))
        setSelectedIds([])
    }

    return (
        <div className="flex h-full text-white bg-black">
            <aside className="w-64 border-r border-zinc-600 p-6">
                <h2 className="text-lg font-bold mb-4">Папки</h2>
                <FolderList
                    folders={folders}
                    onSelect={setSelectedFolderId}
                    selectedId={selectedFolderId}
                />
            </aside>
            <main className="flex flex-col w-full p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">
                            Профили ({profiles.length})
                            {selectedIds.length > 0 && (
                                <span className="text-sm text-zinc-400"></span>
                            )}
                        </h2>
                    </div>
                    <div className="flex items-center">
                        <ActionPanel
                            selectedCount={selectedIds.length}
                            onDownload={handleDownload}
                            onDelete={handleDelete}
                            onUpload={handleUpload}
                        />
                    </div>
                </div>
                <ProfileUploadDialog
                    ref={dialogRef}
                    folderId={selectedFolderId || ''}
                    onSelect={handleProfilesSelected}
                />
                <ProfileTable
                    profiles={profiles}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                />
            </main>
        </div>
    )
}
