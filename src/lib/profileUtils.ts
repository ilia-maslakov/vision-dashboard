import {getProfilesWithMeta} from '@/lib/getProfilesWithMeta'
import {ProfileDescription} from "@/types/profileDescription"

export async function getProfileDescriptionsFromRaw(
    folderId: string,
    rawProfiles: any[]
): Promise<ProfileDescription[]> {
    const {statuses, tags} = await getProfilesWithMeta(folderId)

    const statusMap = Object.fromEntries(statuses.map((s: any) => [s.id, s.status]))
    const tagMap = Object.fromEntries(tags.map((t: any) => [t.id, t.tag_name]))

    return rawProfiles.map((p: any) => ({
        name: p.profile_name || '—',
        status: statusMap[p.profile_status] || p.profile_status || '—',
        tag: (p.profile_tags || []).map((id: string) => tagMap[id] || id).join(', ') || undefined,
        note: p.profile_notes?.replace(/<[^>]*>?/gm, '').trim() || undefined,
    }))
}
