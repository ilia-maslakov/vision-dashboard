import React, { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProfileTable } from './ProfileTable'
import { describe, it, expect } from 'vitest'
import {Profile} from "@/types/profile";

const profilesMock: Profile[] = [
  {
    id: '1',
    email: 'user1@example.com',
    os: 'apple',
    status: 'active',
    tag: 'tag1',
    note: 'Note 1',
  },
  {
    id: '2',
    email: 'user2@example.com',
    os: 'android',
    status: 'inactive',
    tag: 'tag2',
    note: 'Note 2',
  },
]

describe('ProfileTable', () => {
  it('renders message when no profiles', () => {
    render(
      <ProfileTable
        profiles={[]}
        selectedIds={[]}
        onSelectionChangeAction={() => {}}
      />
    )
    expect(screen.getByText(/Нет профилей для отображения/i)).toBeInTheDocument()
  })

  it('renders profiles and allows selection toggling', () => {
    function Wrapper() {
      const [selectedIds, setSelectedIds] = useState<string[]>([])
      return (
        <ProfileTable
          profiles={profilesMock}
          selectedIds={selectedIds}
          onSelectionChangeAction={setSelectedIds}
        />
      )
    }

    render(<Wrapper />)

    // Проверяем что профили отображаются
    expect(screen.getByText('user1@example.com')).toBeInTheDocument()
    expect(screen.getByText('user2@example.com')).toBeInTheDocument()

    // Кликаем чекбокс первого профиля
    const checkboxes = screen.getAllByRole('checkbox')
    const firstCheckbox = checkboxes[1] // первый чекбокс — select all

    fireEvent.click(firstCheckbox)
    // После клика должен появиться выбранный id '1'
    expect(checkboxes[1]).toBeChecked()
  })

  it('toggles select all checkbox', () => {
    function Wrapper() {
      const [selectedIds, setSelectedIds] = useState<string[]>([])
      return (
        <ProfileTable
          profiles={profilesMock}
          selectedIds={selectedIds}
          onSelectionChangeAction={setSelectedIds}
        />
      )
    }

    render(<Wrapper />)

    const checkboxes = screen.getAllByRole('checkbox')
    const selectAllCheckbox = checkboxes[0]

    // Кликаем select all, все должны выделиться
    fireEvent.click(selectAllCheckbox)
    expect(selectAllCheckbox).toBeChecked()

    // Кликаем select all снова, все должны сняться
    fireEvent.click(selectAllCheckbox)
    expect(selectAllCheckbox).not.toBeChecked()
  })
})
