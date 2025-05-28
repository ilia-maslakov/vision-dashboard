import { NextRequest } from 'next/server'

const BASE = 'https://v1.empr.cloud/api/v1'
const TOKEN = process.env.EMPR_TOKEN!

const headers = {
  'X-Token': TOKEN,
}

const fetchJson = async (url: string) => {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`Ошибка запроса ${url}: ${res.status}`)
  return res.json()
}

export async function GET(req: NextRequest) {
  const folderId = req.nextUrl.searchParams.get('folderId')
  if (!folderId) {
    return new Response(JSON.stringify({ error: 'folderId required' }), { status: 400 })
  }

  const profilesRes = await fetchJson(`${BASE}/folders/${folderId}/profiles?ps=1000`)
  const items = profilesRes.data?.items || []

  const result = []

  for (const profile of items) {
    const profile_name: string = profile.profile_name || ''
    const profile_notes: string= profile.profile_notes || ''
    const profile_status: string = profile.profile_status || null
    const profile_tags = profile.profile_tags || []
    const profileId: string = profile.id
    const proxy = profile.proxy || null

    let cookie = []
    try {
      const cookiesRes = await fetchJson(`${BASE}/cookies/${folderId}/${profileId}`)
      cookie = cookiesRes.data || []
    } catch (err) {
      console.warn(`Куки не получены для профиля ${profile_name}: ${err}`)
    }

    result.push({
      profile_name,
      proxy,
      profile_notes,
      profile_status,
      profile_tags,
      cookie,
    })
  }

  return new Response(JSON.stringify(result, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="profiles.json"',
    },
  })
}
