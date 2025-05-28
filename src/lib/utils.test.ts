import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as authModule from './authToken'

describe('authToken', () => {
  beforeEach(() => {
    authModule.setCachedToken(null)
    vi.resetAllMocks()

    global.fetch = vi.fn((input) => {
      if (input === '/api/internal/empr-token') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ token: 'test-token' }),
        } as Response)
      }
      return Promise.reject(new Error('Unhandled fetch: ' + input))
    })
  })

  it('returns cached token if already set', async () => {
    authModule.setCachedToken('cached-token')

    // fetch не должен быть вызван, кидаем ошибку при вызове
    global.fetch = vi.fn(() => {
      throw new Error('fetch не должен быть вызван')
    })

    const token = await authModule.token()
    expect(token).toBe('cached-token')
  })

  it('fetches token if not cached', async () => {
    const token = await authModule.token()
    expect(token).toBe('test-token')
  })

  it('throws if token fetch fails', async () => {
    // Переопределяем fetch, чтобы вернуть неудачный ответ
    global.fetch = vi.fn(() => Promise.resolve({ ok: false } as Response))

    authModule.setCachedToken(null) // очищаем кеш
    await expect(authModule.token()).rejects.toThrow('Unauthorized (EMPR_TOKEN)')
  })
})
