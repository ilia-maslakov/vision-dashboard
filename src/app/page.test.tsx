import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import HomePage from './page'

vi.mock('next-auth/react', () => ({
    useSession: () => ({ status: 'authenticated' }),
}))

vi.mock('next/navigation', () => ({
    useRouter: () => ({ replace: vi.fn() }),
}))

vi.mock('@/lib/emprClient', () => ({
    getFolders: () => Promise.resolve({ data: [{ id: '1', folder_name: 'Test folder' }] }),
    getProfilesWithMeta: () => Promise.resolve({ profiles: [], statuses: [], tags: [] }),
    uploadProfiles: vi.fn(),
    deleteProfiles: vi.fn(),
}))

vi.mock('@/components/FolderList', () => ({
    FolderList: () => <div data-testid="folder-list">MockFolderList</div>,
}))

vi.mock('@/components/ActionPanel', () => ({
    ActionPanel: () => <div data-testid="action-panel">MockActionPanel</div>,
}))

vi.mock('@/components/ProfileTable', () => ({
    ProfileTable: () => <div data-testid="profile-table">MockProfileTable</div>,
}))

vi.mock('@/components/ProfileUploadDialog', () => ({
    ProfileUploadDialog: () => <div data-testid="upload-dialog">MockUploadDialog</div>,
}))

describe('HomePage', () => {
    it('renders layout with folders and main components', async () => {
        render(<HomePage />)

        await waitFor(() => {
            expect(screen.getByText('Папки')).toBeInTheDocument()
            expect(screen.getByTestId('folder-list')).toBeInTheDocument()
            expect(screen.getByTestId('action-panel')).toBeInTheDocument()
            expect(screen.getByTestId('profile-table')).toBeInTheDocument()
            expect(screen.getByTestId('upload-dialog')).toBeInTheDocument()
        })
    })
})
