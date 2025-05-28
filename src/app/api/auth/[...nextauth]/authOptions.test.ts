import {describe, it, expect, vi, beforeEach, Mock} from 'vitest'
import * as fs from 'fs'
import {authOptions, loadUsers} from './authOptions'

vi.mock('fs')

describe('loadUsers()', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('успешно загружает и парсит users.json', () => {
    const usersData = JSON.stringify([{ username: 'user1', passwordHash: 'hash1' }])
    ;(fs.readFileSync as Mock).mockReturnValue(usersData)

    const users = loadUsers()
    expect(users).toEqual([{ username: 'user1', passwordHash: 'hash1' }])
  })

  it('возвращает пустой массив при ошибке', () => {
    ;(fs.readFileSync as Mock).mockImplementation(() => {
      throw new Error('File not found')
    })

    const users = loadUsers()
    expect(users).toEqual([])
  })
})
describe('authOptions.callbacks.session', () => {
  it('копирует token.sub в session.user.name', async () => {
    const session = { user: { name: '' } }
    const token = { sub: 'user1' }

    const result = await authOptions.callbacks.session!({ session, token } as any)

    expect(result.user.name).toBe('user1')
  })

  it('не трогает session.user.name если token.sub отсутствует', async () => {
    const session = { user: { name: 'existing' } }
    const token = {}

    const result = await authOptions.callbacks.session!({ session, token } as any)

    expect(result.user.name).toBe('existing')
  })
})
