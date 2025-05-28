// src/lib/uploadCookies.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { uploadCookies } from './uploadCookies'

// мок для fetch и токена
const fetchMock = vi.fn()
const tokenMock = vi.fn()

vi.mock('./authToken', () => ({
  BASE: 'https://example.com/api',
  token: () => tokenMock(),
}))

global.fetch = fetchMock

beforeEach(() => {
  fetchMock.mockReset()
  tokenMock.mockReset()
})

describe('uploadCookies', () => {
  const folderId = 'folder123'
  const profileId = 'profile456'
  const cookies = [{ name: 'sid', value: 'abc123' }]

  it('успешно загружает cookies', async () => {
    tokenMock.mockResolvedValue('mock-token')
    fetchMock.mockResolvedValueOnce({ ok: true })

    await uploadCookies(folderId, profileId, cookies)

    expect(fetchMock).toHaveBeenCalledWith(
        'https://example.com/api/cookies/import/folder123/profile456',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'X-Token': 'mock-token',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cookies }),
        })
    )
  })

  it('кидает ошибку при неудачном запросе', async () => {
    tokenMock.mockResolvedValue('mock-token')
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: vi.fn().mockResolvedValue('Internal Server Error'),
    })

    await expect(uploadCookies(folderId, profileId, cookies)).rejects.toThrow(
        'Ошибка загрузки куков: 500 - Internal Server Error'
    )
  })
})
