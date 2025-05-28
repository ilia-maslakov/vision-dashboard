import '@testing-library/jest-dom'
import { vi } from 'vitest'

global.fetch = vi.fn((input, init) => {
  const url = typeof input === 'string' ? input : input.url

  if (url.includes('/api/internal/empr-token')) {
    return Promise.resolve({
      ok: true,
      json: async () => ({ token: 'mocked-token' }),
    } as Response)
  }

  if (url.includes('https://v1.empr.cloud/api/v1/folders')) {
    return Promise.resolve({
      ok: true,
      json: async () => ({
        data: [
          { id: 'folder1', folder_name: 'Folder 1', deleted_at: null },
          { id: 'folder2', folder_name: 'Folder 2', deleted_at: null },
        ],
      }),
    } as Response)
  }

  return Promise.reject(new Error(`Unhandled fetch request: ${url}`))
})
