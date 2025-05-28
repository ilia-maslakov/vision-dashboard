// src/app/api/internal/empr-token/route.test.ts
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest'
import { GET } from './route'
import { getServerSession } from 'next-auth'

/* ------------------------------------------------------------------ */
/* 1.  Мокаем getServerSession                                         */
/* ------------------------------------------------------------------ */
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))
const getSessionMock = getServerSession as unknown as Mock

/* ------------------------------------------------------------------ */
/* 2.  Сохраняем/восстанавливаем переменные окружения                  */
/* ------------------------------------------------------------------ */
const OLD_TOKEN = process.env.EMPR_TOKEN

beforeEach(() => {
  getSessionMock.mockReset()
})

afterEach(() => {
  process.env.EMPR_TOKEN = OLD_TOKEN
  vi.restoreAllMocks()
})

/* ------------------------------------------------------------------ */
/* 3.  Набор тестов                                                    */
/* ------------------------------------------------------------------ */
describe('GET /api/internal/empr-token', () => {
  it('возвращает 401, если сессия отсутствует', async () => {
    getSessionMock.mockResolvedValueOnce(null)

    const res = await GET()
    expect(res.status).toBe(401)
    expect(await res.text()).toBe('Unauthorized')
  })

  it('возвращает 500, если токен не задан', async () => {
    getSessionMock.mockResolvedValueOnce({ user: { name: 'alice' } })
    delete process.env.EMPR_TOKEN

    const res = await GET()
    expect(res.status).toBe(500)
    expect(await res.text()).toBe('EMPR_TOKEN not set')
  })

  it('возвращает 200 и JSON c токеном, если всё ок', async () => {
    getSessionMock.mockResolvedValueOnce({ user: { name: 'alice' } })
    process.env.EMPR_TOKEN = 'secret-token'

    const res = await GET()
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toMatch(/application\/json/)
    expect(await res.json()).toEqual({ token: 'secret-token' })
  })
})
