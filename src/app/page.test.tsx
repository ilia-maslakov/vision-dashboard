import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'

const replace = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({ replace }),
    __esModule: true,
}))
const useSessionMock = vi.fn()

vi.mock('next-auth/react', () => ({ useSession: () => useSessionMock() }))

interface HandlerActions {
    getFolders: Mock
    getProfilesWithMeta: Mock
    deleteProfiles: Mock
    uploadProfiles: Mock
}
const handlerActions = vi.hoisted(() => ({} as HandlerActions))

vi.mock('@/lib/getFolders', () => {
    handlerActions.getFolders = vi.fn()
    return { getFolders: handlerActions.getFolders }
})
vi.mock('@/lib/getProfilesWithMeta', () => {
    handlerActions.getProfilesWithMeta = vi.fn()
    return { getProfilesWithMeta: handlerActions.getProfilesWithMeta }
})
vi.mock('@/lib/deleteProfiles', () => {
    handlerActions.deleteProfiles = vi.fn()
    return { deleteProfiles: handlerActions.deleteProfiles }
})
vi.mock('@/lib/uploadProfiles', () => {
    handlerActions.uploadProfiles = vi.fn()
    return { uploadProfiles: handlerActions.uploadProfiles }
})

/* ─── лёгкий мок диалога загрузки ─── */
vi.mock('@/components/ProfileUploadDialog', () => {
    const __onSelectRef: { current: ((p: any[]) => void) | null } = { current: null }
    return {
        ProfileUploadDialog: ({ onSelect }: any) => {
            __onSelectRef.current = onSelect
            return <div data-testid="fake-dialog" />
        },
        __onSelectRef,
        __esModule: true,
    }
})

import * as dialogMock from '@/components/ProfileUploadDialog'

const onSelectRef = (dialogMock as any).__onSelectRef as {
    current: ((p: any[]) => void) | null
}

import HomePage from './page'

const foldersResp = { data: [{ id: 'f1', folder_name: 'Folder 1' }] }
const metaResp = {
    profiles: [
        {
            id: 'p1',
            profile_name: 'Alice',
            profile_status: 's1',
            profile_tags: ['t1'],
            profile_notes: '<b>note</b>',
        },
    ],
    statuses: [{ id: 's1', status: 'Active' }],
    tags: [{ id: 't1', tag_name: 'VIP' }],
}

const clickFirstRowCheckbox = async () => {
    const checkboxes = await screen.findAllByRole('checkbox')
    fireEvent.click(checkboxes[1]) // second = first row
}

describe('HomePage – полный флоу', () => {
    beforeEach(() => {
        vi.resetAllMocks()
        useSessionMock.mockReturnValue({ status: 'authenticated' })
        vi.stubGlobal('URL', {
            createObjectURL: vi.fn(() => 'blob://url'),
            revokeObjectURL: vi.fn(),
        } as any)
    })

    it('получает папки, кликает по папке и загружает профили', async () => {
        handlerActions.getFolders.mockResolvedValueOnce(foldersResp)
        handlerActions.getProfilesWithMeta.mockResolvedValueOnce(metaResp)

        render(<HomePage />)

        await waitFor(() => expect(handlerActions.getFolders).toHaveBeenCalled())
        fireEvent.click(screen.getByText('Folder 1'))
        await waitFor(() =>
            expect(handlerActions.getProfilesWithMeta).toHaveBeenCalledWith('f1'),
        )

        expect(await screen.findByText('Alice')).toBeInTheDocument()
        expect(screen.getByText('Active')).toBeInTheDocument()
        expect(screen.getByText('VIP')).toBeInTheDocument()
        expect(screen.getByText('note')).toBeInTheDocument()
    })

    it('удаляет профиль и перезагружает список', async () => {
        handlerActions.getFolders.mockResolvedValueOnce(foldersResp)
        handlerActions.getProfilesWithMeta.mockResolvedValue(metaResp)

        render(<HomePage />)

        fireEvent.click(await screen.findByText('Folder 1'))
        await clickFirstRowCheckbox()
        fireEvent.click(screen.getByRole('button', { name: 'Удалить' }))

        await waitFor(() =>
            expect(handlerActions.deleteProfiles).toHaveBeenCalledWith('f1', ['p1']),
        )
        expect(handlerActions.getProfilesWithMeta).toHaveBeenCalledTimes(2)
    })

    it('загружает профили через upload и перезагружает таблицу', async () => {
        handlerActions.getFolders.mockResolvedValueOnce(foldersResp)
        handlerActions.getProfilesWithMeta.mockResolvedValue(metaResp)
        handlerActions.uploadProfiles.mockResolvedValueOnce(undefined)

        render(<HomePage />)
        fireEvent.click(await screen.findByText('Folder 1'))
        fireEvent.click(screen.getByRole('button', { name: 'Загрузить' }))

        onSelectRef.current?.([{ id: 'p2' }])

        await waitFor(() => expect(handlerActions.uploadProfiles).toHaveBeenCalled())
        expect(handlerActions.getProfilesWithMeta).toHaveBeenCalledTimes(2)
    })

    it('handleDownload создаёт ссылку и скачивает blob', async () => {
        handlerActions.getFolders.mockResolvedValueOnce(foldersResp)
        handlerActions.getProfilesWithMeta.mockResolvedValueOnce(metaResp)

        const blob = new Blob(['{}'], { type: 'application/json' })
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            blob: () => Promise.resolve(blob),
        }) as any
        vi.spyOn(global, 'prompt').mockReturnValue('dump')
        const appendSpy = vi.spyOn(document.body, 'appendChild')

        render(<HomePage />)
        fireEvent.click(await screen.findByText('Folder 1'))
        fireEvent.click(screen.getByRole('button', { name: 'Скачать' }))

        await waitFor(() => expect(appendSpy).toHaveBeenCalled())
    })
})
