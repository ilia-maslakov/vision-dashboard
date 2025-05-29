import { NextRequest } from 'next/server'

const BASE   = 'https://v1.empr.cloud/api/v1'
const TOKEN  = process.env.EMPR_TOKEN!
const HEADERS = { 'X-Token': TOKEN }

const fetchJson = async (url: string) => {
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error(`Ошибка запроса ${url}: ${res.status}`)
  return res.json()
}

export async function GET(req: NextRequest) {
  const folderId = req.nextUrl.searchParams.get('folderId')
  if (!folderId) return new Response('folderId required', { status: 400 })

  const idsParam  = req.nextUrl.searchParams.get('ids')       // "id1,id2,id3"
  const filterIds = idsParam ? idsParam.split(',').filter(Boolean) : null

  const { data: { items: allProfiles = [] } = {} } =
      await fetchJson(`${BASE}/folders/${folderId}/profiles?ps=1000`)

  const profiles = filterIds ? allProfiles.filter(p => filterIds.includes(p.id))
      : allProfiles

  const result = []
  for (const p of profiles) {
    const { id, profile_name = '', profile_notes = '',
      profile_status = null, profile_tags = [], proxy = null } = p

    let cookie: any[] = []
    try {
      const { data = [] } = await fetchJson(`${BASE}/cookies/${folderId}/${id}`)
      cookie = data
    } catch (e) {
      console.warn(`Куки не получены для профиля ${profile_name}: ${e}`)
    }

    result.push({ profile_name, proxy, profile_notes, profile_status, profile_tags, cookie })
  }

  const filename = `profiles-${new Date().toISOString().slice(0,10).replace(/-/g,'')}.json`
  return new Response(JSON.stringify(result, null, 2), {
    headers: {
      'Content-Type':        'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
