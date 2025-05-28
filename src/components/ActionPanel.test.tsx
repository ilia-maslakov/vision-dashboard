import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { ProfileTable } from './ProfileTable'
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
    const onSelectionChangeAction = vi.fn()

    render(
      <ProfileTable
        profiles={profilesMock}
        selectedIds={[]}
        onSelectionChangeAction={onSelectionChangeAction}
      />
    )

    // Проверяем, что профили отображаются
    expect(screen.getByText('user1@example.com')).toBeInTheDocument()
    expect(screen.getByText('user2@example.com')).toBeInTheDocument()

    // Кликаем чекбокс первого профиля
    const firstCheckbox = screen.getAllByRole('checkbox')[1] // [0] - select all
    fireEvent.click(firstCheckbox)
    expect(onSelectionChangeAction).toHaveBeenCalledWith(['1'])
  })

  it('toggles select all checkbox', () => {
    let selectedIds: string[] = []

    const onSelectionChangeAction = vi.fn((ids: string[]) => {
      selectedIds = ids
    })

    const { rerender } = render(
      <ProfileTable
        profiles={profilesMock}
        selectedIds={selectedIds}
        onSelectionChangeAction={onSelectionChangeAction}
      />
    )

    // Кликаем чекбокс "выбрать все"
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(selectAllCheckbox)

    expect(onSelectionChangeAction).toHaveBeenCalledWith(['1', '2'])

    // Перерендер с выделенными всеми профилями
    rerender(
      <ProfileTable
        profiles={profilesMock}
        selectedIds={['1', '2']}
        onSelectionChangeAction={onSelectionChangeAction}
      />
    )

    // Кликаем по чекбоксу "выбрать все" чтобы снять выделение
    fireEvent.click(selectAllCheckbox)
    expect(onSelectionChangeAction).toHaveBeenCalledWith([])
  })
})
