import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchDefaultProfile } from './fetchDefaultProfile'

describe('fetchDefaultProfile', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('fetches and returns default profile JSON', async () => {
    const mockData = { profile: 'default' }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    }) as any

    const result = await fetchDefaultProfile()
    expect(result).toEqual(mockData)
  })

  it('throws if fetch fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    }) as any

    await expect(fetchDefaultProfile()).rejects.toThrow('Не удалось загрузить defaultProfile.json')
  })
})
