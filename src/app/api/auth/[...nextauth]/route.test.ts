import { describe, it, expect, vi, Mock } from 'vitest'

interface Capture {
  options?: unknown
  handler?: Mock
}
const capture = vi.hoisted(() => ({} as Capture))

vi.mock('fs', () => ({
  readFileSync: vi.fn(() =>
      JSON.stringify([{ username: 'alice', passwordHash: 'hash' }]),
  ),
}))
vi.mock('bcrypt', () => ({
  compare: vi.fn().mockResolvedValue(true),
}))

vi.mock('next-auth', () => {
  const defaultFn = vi.fn((opts: unknown) => {
    capture.options = opts
    const stub = vi.fn()
    capture.handler = stub
    return stub
  })
  return { default: defaultFn }
})

import * as authModule from './authOptions'
import * as route from './route'
import NextAuth from 'next-auth'

const authorize = (
    authModule.authOptions.providers[0] as any
).authorize as (c: { username: string; password: string }) => Promise<any>

describe('[...nextauth] route', () => {
  it('GET и POST экспортируют одинаковый handler', () => {
    expect(route.GET).toBe(capture.handler)
    expect(route.POST).toBe(capture.handler)
  })

  it('NextAuth вызван один раз с authOptions', () => {
    const NextAuthMock = NextAuth as unknown as Mock
    expect(NextAuthMock).toHaveBeenCalledTimes(1)
    expect(capture.options).toBe(authModule.authOptions)
  })
})

describe('Credentials.authorize', () => {

  it('возвращает null при неверном пароле', async () => {
    const bcrypt = await import('bcrypt')
    ;(bcrypt.compare as Mock).mockResolvedValueOnce(false)

    const user = await authorize({ username: 'alice', password: 'wrong' })
    expect(user).toBeNull()
  })

  it('возвращает null для неизвестного пользователя', async () => {
    const user = await authorize({ username: 'bob', password: 'x' })
    expect(user).toBeNull()
  })
})
