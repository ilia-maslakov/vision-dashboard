const BASE = 'https://v1.empr.cloud/api/v1'

function token(): string {
    const t = process.env.NEXT_PUBLIC_EMPR_TOKEN
    if (!t) throw new Error('EMPR_TOKEN not set')
    return t
}

export async function getFolders() {
    const res = await fetch(`${BASE}/folders`, {
        headers: {'X-Token': token()},
        cache: 'no-store',
    })
    if (!res.ok) throw new Error('Cannot load folders')
    const json = await res.json()
    const filtered = (json.data || []).filter((folder: any) => !folder.deleted_at)
    return {data: filtered}
}

export async function getProfilesWithMeta(folderId: string) {
    const headers = {'X-Token': token()}

    const [profilesRes, statusesRes, tagsRes] = await Promise.all([
        fetch(`${BASE}/folders/${folderId}/profiles?ps=1000`, {headers}),
        fetch(`${BASE}/folders/${folderId}/statuses`, {headers}),
        fetch(`${BASE}/folders/${folderId}/tags`, {headers}),
    ])

    if (!profilesRes.ok) throw new Error(`profiles: ${profilesRes.status}`)
    if (!statusesRes.ok) throw new Error(`statuses: ${statusesRes.status}`)
    if (!tagsRes.ok) throw new Error(`tags: ${tagsRes.status}`)

    const profilesJson = await profilesRes.json()
    const statusesJson = await statusesRes.json()
    const tagsJson = await tagsRes.json()

    return {
        profiles: profilesJson.data?.items || [],
        statuses: statusesJson.data || [],
        tags: tagsJson.data || [],
    }
}

export async function deleteProfiles(folderId: string, ids: string[]): Promise<void> {
    const headers = {'X-Token': token()}

    for (const id of ids) {
        const res = await fetch(`${BASE}/folders/${folderId}/profiles/${id}`, {
            method: 'DELETE',
            headers,
        })
        if (!res.ok) {
            console.warn(`Не удалось удалить профиль ${id}: ${res.status}`)
        }
    }
}

export async function uploadProfiles(folderId: string, profiles: any[]) {
    for (const profile of profiles) {
        try {
            const profileId = await createProfile(folderId, profile)
            if (profile.cookie?.length) {
                await uploadCookies(folderId, profileId, profile.cookie)
            }
        } catch (e: any) {
            console.error(`Ошибка обработки профиля ${profile.profile_name}:`, e.message)
        }
    }
}

async function fetchDefaultProfile(): Promise<any> {
    const res = await fetch('/defaultProfile.json') // from public folder
    if (!res.ok) throw new Error('Не удалось загрузить defaultProfile.json')
    return await res.json()
}

async function createProfile(folderId: string, profile: any): Promise<string> {
    const defaultProfile = await fetchDefaultProfile()
    const url = `${BASE}/folders/${folderId}/profiles`
    const body = {...defaultProfile}

    body.profile_name = profile.profile_name
    body.profile_notes = profile.profile_notes || ''
    body.profile_status = profile.profile_status || null
    body.profile_tags = profile.profile_tags || []

    if (profile.proxy) {
        body.proxy_id = await ensureProxy(folderId, profile.proxy)
    }

    const res = await fetch(url, {
        method: 'POST',
        headers: {"X-Token": token(), "Content-Type": "application/json"},
        body: JSON.stringify(body),
    })

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`Ошибка создания профиля: ${res.status} - ${err}`)
    }

    const result = await res.json()
    return result.data.id
}

async function ensureProxy(folderId: string, proxy: any): Promise<string> {
    const listUrl = `${BASE}/folders/${folderId}/proxies`
    const proxyList = (await fetchJson(listUrl)).data.items ?? []

    const found = proxyList.find((p: any) =>
        p.proxy_ip === proxy.proxy_ip &&
        p.proxy_port === proxy.proxy_port &&
        p.proxy_username === proxy.proxy_username &&
        p.proxy_password === proxy.proxy_password
    )

    if (found) return found.id

    const createUrl = `${BASE}/folders/${folderId}/proxies`
    const body = {
        proxies: [
            {
                proxy_name: proxy.proxy_name,
                proxy_type: proxy.proxy_type || 'HTTP',
                proxy_ip: proxy.proxy_ip,
                proxy_port: proxy.proxy_port,
                proxy_username: proxy.proxy_username,
                proxy_password: proxy.proxy_password,
            },
        ],
    }

    const result = await fetchJson(createUrl, {
        method: 'POST',
        body: JSON.stringify(body),
    })

    return result.data[0].id
}

async function uploadCookies(folderId: string, profileId: string, cookies: any[]) {
    const importUrl = `${BASE}/cookies/import/${folderId}/${profileId}`
    const res = await fetch(importUrl, {
        method: 'POST',
        headers: {"X-Token": token(), "Content-Type": "application/json"},
        body: JSON.stringify({cookies}),
    })
    if (!res.ok) {
        const msg = await res.text()
        throw new Error(`Ошибка загрузки куков: ${res.status} - ${msg}`)
    }
}

async function fetchJson(url: string, options: RequestInit = {}) {
    const res = await fetch(url, {...options, headers: {"X-Token": token(), "Content-Type": "application/json"}})
    if (!res.ok) {
        const err = await res.text()
        throw new Error(`Ошибка ${url}: ${res.status} - ${err}`)
    }
    return res.json()
}