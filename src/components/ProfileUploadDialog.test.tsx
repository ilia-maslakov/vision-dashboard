import React from 'react'
import {Mock, vi} from 'vitest'
import {act, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {ProfileUploadDialog, ProfileUploadDialogRef} from './ProfileUploadDialog'
import {getProfileDescriptionsFromRaw} from '@/lib/profileUtils'

vi.mock('@/lib/profileUtils', () => ({
    getProfileDescriptionsFromRaw: vi.fn(),
}))

describe('ProfileUploadDialog', () => {
    const folderId = 'folder1'
    const mockOnSelect = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should open modal with descriptions after file load and allow confirm selection', async () => {
        const fileContent = JSON.stringify([
            {profile_name: 'Alice'},
            {profile_name: 'Bob'},
        ])

        const descriptionsMock = [
                {name: 'Alice', status: 'active', tag: 'tag1', note: 'note1'},
                {name: 'Bob', status: 'inactive', tag: '', note: ''},
            ]

        ;(getProfileDescriptionsFromRaw as unknown as Mock).mockResolvedValue(descriptionsMock)

        const ref = React.createRef<ProfileUploadDialogRef>()

        render(<ProfileUploadDialog folderId={folderId} onSelect={mockOnSelect} ref={ref}/>)

        const file = new File([fileContent], 'profiles.json', {type: 'application/json'}) as any
        file.text = async () => fileContent

        // Обёртываем вызов handleFile в act
        await act(async () => {
            ref.current?.handleFile(file)
        })

        await waitFor(() => {
            expect(screen.getByText(/Выберите профили для загрузки/)).toBeInTheDocument()
        })

        const checkboxes = screen.getAllByRole('checkbox')
        const bobCheckbox = checkboxes[2]

        await userEvent.click(bobCheckbox)
        await userEvent.click(screen.getByText('Загрузить'))

        expect(mockOnSelect).toHaveBeenCalledWith([{profile_name: 'Alice'}])
    })

    it('should close modal on cancel', async () => {
        const fileContent = JSON.stringify([{profile_name: 'Alice'}])

        ;
        (getProfileDescriptionsFromRaw as unknown as Mock).mockResolvedValue([{
            name: 'Alice',
            status: 'active',
            tag: '',
            note: ''
        }])

        const ref = React.createRef<ProfileUploadDialogRef>()

        render(<ProfileUploadDialog folderId={folderId} onSelect={mockOnSelect} ref={ref}/>)

        const file = new File([fileContent], 'profiles.json', {type: 'application/json'}) as any
        file.text = async () => fileContent

        await act(async () => {
            ref.current?.handleFile(file)
        })

        await waitFor(() => {
            expect(screen.getByText(/Выберите профили для загрузки/)).toBeInTheDocument()
        })

        await userEvent.click(screen.getByText('Отмена'))

        await waitFor(() => {
            expect(screen.queryByText(/Выберите профили для загрузки/)).not.toBeInTheDocument()
        })
    })
})
