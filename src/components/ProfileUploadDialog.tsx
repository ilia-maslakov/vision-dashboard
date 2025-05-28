import {forwardRef, useImperativeHandle, useState} from 'react'
import {getProfileDescriptionsFromRaw} from '@/lib/profileUtils'
import {ProfileSelectionModal} from './ProfileSelectionModal'
import type {ProfileDescription} from '@/types/profileDescription'

interface Props {
    folderId: string
    onSelect: (selected: any[]) => void
}

export interface ProfileUploadDialogRef {
    handleFile: (file: File) => void
}

export const ProfileUploadDialog = forwardRef<ProfileUploadDialogRef, Props>(
    ({folderId, onSelect}, ref) => {
        const [fileProfiles, setFileProfiles] = useState<any[] | null>(null)
        const [descriptions, setDescriptions] = useState<ProfileDescription[] | null>(null)
        const [showModal, setShowModal] = useState(false)

        const handleFile = async (file: File) => {
            const text = await file.text()
            const parsed = JSON.parse(text)
            const desc = await getProfileDescriptionsFromRaw(folderId, parsed)
            setFileProfiles(parsed)
            setDescriptions(desc)
            setShowModal(true)
        }

        const handleConfirm = (selectedNames: string[]) => {
            if (!fileProfiles) return
            const selected = fileProfiles.filter(p => selectedNames.includes(p.profile_name))
            onSelect(selected)
            setShowModal(false)
        }

        useImperativeHandle(ref, () => ({handleFile}))

        return (
            <>
                {showModal && descriptions && (
                    <ProfileSelectionModal
                        profiles={descriptions}
                        onConfirm={handleConfirm}
                        onCancel={() => setShowModal(false)}
                    />
                )}
            </>
        )
    }
)

ProfileUploadDialog.displayName = 'ProfileUploadDialog'
