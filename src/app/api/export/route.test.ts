// src/app/api/export/route.test.ts
import {describe, it, expect, vi, beforeEach, afterEach, Mock} from 'vitest'
import { GET } from './route'
import type { NextRequest } from 'next/server'

/** Helper that mimics the minimal shape `GET` relies on */
const makeReq = (url: string) => ({
  nextUrl: new URL(url),
}) as unknown as NextRequest

/** Quick “Response-like” stub for the global fetch mock */
const mockRes = (data: any, ok = true, status = 200) => ({
  ok,
  status,
  json: vi.fn().mockResolvedValue(data),
})

describe('GET /api/export', () => {
  const OLD_FETCH = global.fetch
  const OLD_TOKEN = process.env.EMPR_TOKEN

  beforeEach(() => {
    process.env.EMPR_TOKEN = 'test-token'
    global.fetch = vi.fn()
  })

  afterEach(() => {
    global.fetch = OLD_FETCH
    process.env.EMPR_TOKEN = OLD_TOKEN
    vi.restoreAllMocks()
  })

  it('returns 400 when folderId is missing', async () => {
    const res = await GET(makeReq('http://localhost/api/export'))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'folderId required' })
  })

  it('returns aggregated profiles JSON and attachment headers', async () => {
    const folderId = '123'
    const profiles = {
      data: {
        items: [
          {
            id: 'p1',
            profile_name: 'Alice',
            profile_notes: 'note',
            profile_status: 'active',
            profile_tags: ['tag1'],
            proxy: null,
          },
        ],
      },
    }
    const cookies = { data: [{ name: 'c', value: 'v' }] }

    const fetchMock = global.fetch as unknown as Mock
    fetchMock
        .mockResolvedValueOnce(mockRes(profiles)) // profiles list
        .mockResolvedValueOnce(mockRes(cookies)) // cookies for p1

    const res = await GET(makeReq(`http://localhost/api/export?folderId=${folderId}`))

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/json')
    expect(res.headers.get('Content-Disposition')).toContain('profiles.json')

    const body = (await res.json()) as any[]
    expect(body).toEqual([
      {
        profile_name: 'Alice',
        proxy: null,
        profile_notes: 'note',
        profile_status: 'active',
        profile_tags: ['tag1'],
        cookie: cookies.data,
      },
    ])

    // called exactly the two times we mocked
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[0][0]).toBe(
        `https://v1.empr.cloud/api/v1/folders/${folderId}/profiles?ps=1000`,
    )
    expect(fetchMock.mock.calls[1][0]).toBe(
        `https://v1.empr.cloud/api/v1/cookies/${folderId}/p1`,
    )
  })
})
