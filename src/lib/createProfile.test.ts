import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createProfile } from './createProfile'
import * as authModule from './authToken'
import * as fetchDefaultProfileModule from './fetchDefaultProfile'
import * as ensureProxyModule from './ensureProxy'

describe('createProfile', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('creates a profile without proxy', async () => {
    const folderId = 'folder-123'
    const profile = {
      profile_name: 'Test Profile',
      profile_notes: 'Notes',
      profile_status: 'active',
      profile_tags: ['tag1', 'tag2'],
    }

    vi.spyOn(fetchDefaultProfileModule, 'fetchDefaultProfile').mockResolvedValue({
      someDefault: 'defaultValue',
    })
    vi.spyOn(ensureProxyModule, 'ensureProxy').mockResolvedValue('proxy-id') // shouldn't be called here

    vi.spyOn(authModule, 'token').mockResolvedValue('mock-token')

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          id: 'new-profile-id',
        },
      }),
    }) as any

    const result = await createProfile(folderId, profile)

    expect(result).toBe('new-profile-id')
    expect(global.fetch).toHaveBeenCalledWith(
      `https://v1.empr.cloud/api/v1/folders/${folderId}/profiles`,
      expect.objectContaining({
        method: 'POST',
        headers: {
          'X-Token': 'mock-token',
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining(profile.profile_name),
      }),
    )
    expect(ensureProxyModule.ensureProxy).not.toHaveBeenCalled()
  })

  it('creates a profile with proxy', async () => {
    const folderId = 'folder-123'
    const proxyData = {
      proxy_ip: '1.2.3.4',
      proxy_port: 8080,
      proxy_username: 'user',
      proxy_password: 'pass',
      proxy_name: 'proxy1',
      proxy_type: 'HTTP',
    }
    const profile = {
      profile_name: 'Test Profile',
      proxy: proxyData,
    }

    vi.spyOn(fetchDefaultProfileModule, 'fetchDefaultProfile').mockResolvedValue({})
    vi.spyOn(ensureProxyModule, 'ensureProxy').mockResolvedValue('proxy-id')
    vi.spyOn(authModule, 'token').mockResolvedValue('mock-token')

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          id: 'new-profile-id',
        },
      }),
    }) as any

    const result = await createProfile(folderId, profile)

    expect(result).toBe('new-profile-id')
    expect(ensureProxyModule.ensureProxy).toHaveBeenCalledWith(folderId, proxyData)
    expect(global.fetch).toHaveBeenCalled()
  })

  it('throws an error if creation fails', async () => {
    const folderId = 'folder-123'
    const profile = { profile_name: 'Fail Profile' }

    vi.spyOn(fetchDefaultProfileModule, 'fetchDefaultProfile').mockResolvedValue({})
    vi.spyOn(authModule, 'token').mockResolvedValue('mock-token')

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
    }) as any

    await expect(createProfile(folderId, profile)).rejects.toThrow(
      'Ошибка создания профиля: 500 - Internal Server Error',
    )
  })
})
