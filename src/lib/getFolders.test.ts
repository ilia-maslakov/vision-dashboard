// src/lib/getFolders.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as authModule from './authToken'
import { getFolders } from './getFolders'

describe('getFolders', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('successfully fetches and filters folders', async () => {
    vi.spyOn(authModule, 'token').mockResolvedValue('mock-token')

    const mockFolders = [
      { id: 1, deleted_at: null },
      { id: 2, deleted_at: '2025-01-01' },
      { id: 3 },
    ]

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockFolders }),
    }) as any

    const result = await getFolders()

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/folders'), expect.objectContaining({
      headers: { 'X-Token': 'mock-token' },
      cache: 'no-store',
    }))

    // Проверяем что удалённые папки (с deleted_at) исключены
    expect(result.data).toEqual([
      { id: 1, deleted_at: null },
      { id: 3 },
    ])
  })

  it('throws error if fetch response is not ok', async () => {
    vi.spyOn(authModule, 'token').mockResolvedValue('mock-token')

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    }) as any

    await expect(getFolders()).rejects.toThrow('Cannot load folders')
  })
})
