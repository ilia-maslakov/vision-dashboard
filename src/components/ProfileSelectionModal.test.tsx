import React from 'react'
import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProfileSelectionModal } from './ProfileSelectionModal'

const profilesMock = [
  { name: 'user1@example.com', status: 'active', tag: 'tag1', note: 'note1' },
  { name: 'user2@example.com', status: 'inactive', tag: '', note: '' },
]

describe('ProfileSelectionModal', () => {
  it('renders correctly with all profiles selected by default', () => {
    render(
      <ProfileSelectionModal
        profiles={profilesMock}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )
    // Check if profile names are in document
    expect(screen.getByText('user1@example.com')).toBeInTheDocument()
    expect(screen.getByText('user2@example.com')).toBeInTheDocument()

    // All checkboxes should be checked initially
    const checkboxes = screen.getAllByRole('checkbox')
    checkboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked()
    })
  })

  it('toggles individual profile selection', () => {
    render(
      <ProfileSelectionModal
        profiles={profilesMock}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )
    const secondCheckbox = screen.getAllByRole('checkbox')[1] // first is select all
    expect(secondCheckbox).toBeChecked()

    fireEvent.click(secondCheckbox)
    expect(secondCheckbox).not.toBeChecked()

    fireEvent.click(secondCheckbox)
    expect(secondCheckbox).toBeChecked()
  })

  it('toggles select all checkbox', () => {
    render(
      <ProfileSelectionModal
        profiles={profilesMock}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0]
    expect(selectAllCheckbox).toBeChecked()

    fireEvent.click(selectAllCheckbox)
    expect(selectAllCheckbox).not.toBeChecked()
    
    // All individual should be unchecked now
    const checkboxes = screen.getAllByRole('checkbox').slice(1)
    checkboxes.forEach(cb => expect(cb).not.toBeChecked())

    fireEvent.click(selectAllCheckbox)
    expect(selectAllCheckbox).toBeChecked()
  })

  it('calls onCancel when Cancel button clicked', () => {
    const onCancelMock = vi.fn()
    render(
      <ProfileSelectionModal
        profiles={profilesMock}
        onConfirm={() => {}}
        onCancel={onCancelMock}
      />
    )
    fireEvent.click(screen.getByText('Отмена'))
    expect(onCancelMock).toHaveBeenCalled()
  })

  it('calls onConfirm with selected names when Загрузить clicked', () => {
    const onConfirmMock = vi.fn()
    render(
      <ProfileSelectionModal
        profiles={profilesMock}
        onConfirm={onConfirmMock}
        onCancel={() => {}}
      />
    )
    fireEvent.click(screen.getByText('Загрузить'))
    expect(onConfirmMock).toHaveBeenCalledWith([
      'user1@example.com',
      'user2@example.com',
    ])
  })
})
