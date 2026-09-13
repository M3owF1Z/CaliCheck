import { useCallback, useEffect, useState } from 'react'
import type { Profile, ProfileDraft } from '../types'
import {
  loadAllProfiles,
  saveProfile,
  deleteProfile,
  getMyProfileId,
  setMyProfileId,
} from '../storage/profileStore'

function makeId() {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [myProfileId, setMyProfileIdState] = useState<string | null>(getMyProfileId())

  const refresh = useCallback(async () => {
    setLoading(true)
    const list = await loadAllProfiles()
    setProfiles(list.sort((a, b) => b.updatedAt - a.updatedAt))
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createProfile = useCallback(
    async (draft: ProfileDraft, markAsMine = true) => {
      const now = Date.now()
      const profile: Profile = { ...draft, id: makeId(), createdAt: now, updatedAt: now }
      await saveProfile(profile)
      if (markAsMine) {
        setMyProfileId(profile.id)
        setMyProfileIdState(profile.id)
      }
      await refresh()
      return profile
    },
    [refresh],
  )

  const updateProfile = useCallback(
    async (id: string, patch: Partial<ProfileDraft>) => {
      const current = profiles.find((p) => p.id === id)
      if (!current) return
      const updated: Profile = { ...current, ...patch, updatedAt: Date.now() }
      await saveProfile(updated)
      await refresh()
      return updated
    },
    [profiles, refresh],
  )

  const removeProfile = useCallback(
    async (id: string) => {
      await deleteProfile(id)
      await refresh()
    },
    [refresh],
  )

  return {
    profiles,
    loading,
    myProfileId,
    createProfile,
    updateProfile,
    removeProfile,
    refresh,
  }
}
