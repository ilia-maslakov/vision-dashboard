// src/components/ActionPanel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ActionPanel } from './ActionPanel'

describe('ActionPanel', () => {
  it('отображает количество выбранных элементов', () => {
    render(<ActionPanel selectedCount={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('вызывает onUploadAction при клике на кнопку "Загрузить"', () => {
    const onUpload = vi.fn()
    render(<ActionPanel selectedCount={1} onUploadAction={onUpload} />)

    fireEvent.click(screen.getByRole('button', { name: 'Загрузить' }))
    expect(onUpload).toHaveBeenCalled()
  })

  it('вызывает onDownloadAction при клике на кнопку "Скачать"', () => {
    const onDownload = vi.fn()
    render(<ActionPanel selectedCount={1} onDownloadAction={onDownload} />)

    fireEvent.click(screen.getByRole('button', { name: 'Скачать' }))
    expect(onDownload).toHaveBeenCalled()
  })

  it('вызывает onDeleteAction при клике на кнопку "Удалить"', () => {
    const onDelete = vi.fn()
    render(<ActionPanel selectedCount={2} onDeleteAction={onDelete} />)

    fireEvent.click(screen.getByRole('button', { name: 'Удалить' }))
    expect(onDelete).toHaveBeenCalled()
  })

  it('отключает кнопку "Удалить", если selectedCount === 0', () => {
    const onDelete = vi.fn()
    render(<ActionPanel selectedCount={0} onDeleteAction={onDelete} />)

    const deleteButton = screen.getByRole('button', { name: 'Удалить' })
    expect(deleteButton).toBeDisabled()
    fireEvent.click(deleteButton)
    expect(onDelete).not.toHaveBeenCalled()
  })
})
