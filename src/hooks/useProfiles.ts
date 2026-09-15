import { useCallback, useEffect, useRef, useState } from 'react'
import type { Profile, ProfileDraft } from '../types'
import {
  loadAllProfiles,
  saveProfile,
  deleteProfile,
  getMyProfileId,
  setMyProfileId,
  subscribeToRemoteChanges,
} from '../storage/profileStore'

function makeId() {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function sortProfiles(list: Profile[]) {
  return [...list].sort((a, b) => b.updatedAt - a.updatedAt)
}

/**
 * IMPORTANT: mutations (create/update/remove) update React state
 * synchronously/optimistically and persist in the background. They never
 * flip the `loading` flag back on, because doing so used to unmount the
 * whole page (showing "Ładowanie…") on every single keystroke in a
 * measurement or variation input — which is what kicked users out of text
 * fields while typing. `loading` is now only true for the very first
 * fetch; `refresh()` is still available for an explicit manual sync.
 */
export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [myProfileId, setMyProfileIdState] = useState<string | null>(getMyProfileId())
  const profilesRef = useRef<Profile[]>([])
  profilesRef.current = profiles

  const refresh = useCallback(async () => {
    setLoading(true)
    const list = await loadAllProfiles()
    setProfiles(sortProfiles(list))
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Live updates from other users/devices (only active when Supabase is configured).
  useEffect(() => {
    const unsubscribe = subscribeToRemoteChanges(
      (incoming) => {
        setProfiles((prev) => {
          const map = new Map(prev.map((p) => [p.id, p]))
          const existing = map.get(incoming.id)
          if (!existing || incoming.updatedAt > existing.updatedAt) {
            map.set(incoming.id, incoming)
          }
          return sortProfiles(Array.from(map.values()))
        })
      },
      (deletedId) => {
        setProfiles((prev) => prev.filter((p) => p.id !== deletedId))
      },
    )
    return unsubscribe
  }, [])

  const createProfile = useCallback(async (draft: ProfileDraft, markAsMine = true) => {
    const now = Date.now()
    const profile: Profile = { ...draft, id: makeId(), createdAt: now, updatedAt: now }
    setProfiles((prev) => sortProfiles([...prev, profile]))
    if (markAsMine) {
      setMyProfileId(profile.id)
      setMyProfileIdState(profile.id)
    }
    saveProfile(profile).catch((err) => console.warn('Zapis profilu nie powiódł się', err))
    return profile
  }, [])

  const updateProfile = useCallback(async (id: string, patch: Partial<ProfileDraft>) => {
    const current = profilesRef.current.find((p) => p.id === id)
    if (!current) return
    const updated: Profile = { ...current, ...patch, updatedAt: Date.now() }
    setProfiles((prev) => sortProfiles(prev.map((p) => (p.id === id ? updated : p))))
    saveProfile(updated).catch((err) => console.warn('Zapis profilu nie powiódł się', err))
    return updated
  }, [])

  const removeProfile = useCallback(async (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id))
    deleteProfile(id).catch((err) => console.warn('Usunięcie profilu nie powiodło się', err))
  }, [])

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
