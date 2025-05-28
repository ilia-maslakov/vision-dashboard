import { BASE, token } from './authToken'

export async function getProfilesWithMeta(folderId: string) {
  const headers = { 'X-Token': await token() }

  const [profilesRes, statusesRes, tagsRes] = await Promise.all([
    fetch(`${BASE}/folders/${folderId}/profiles?ps=1000`, { headers }),
    fetch(`${BASE}/folders/${folderId}/statuses`, { headers }),
    fetch(`${BASE}/folders/${folderId}/tags`, { headers }),
  ])

  if (!profilesRes.ok) throw new Error(`profiles: ${profilesRes.status}`)
  if (!statusesRes.ok) throw new Error(`statuses: ${statusesRes.status}`)
  if (!tagsRes.ok) throw new Error(`tags: ${tagsRes.status}`)

  return {
    profiles: (await profilesRes.json()).data?.items || [],
    statuses: (await statusesRes.json()).data || [],
    tags: (await tagsRes.json()).data || [],
  }
}
