import type { Profile } from '../types'
import { isSupabaseConfigured, supabase, PROFILES_TABLE } from './supabaseClient'

const PROFILES_KEY = 'calisthenics:profiles'
const MY_PROFILE_KEY = 'calisthenics:myProfileId'

function readLocal(): Profile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY)
    return raw ? (JSON.parse(raw) as Profile[]) : []
  } catch {
    return []
  }
}

function writeLocal(profiles: Profile[]) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
}

export function getMyProfileId(): string | null {
  return localStorage.getItem(MY_PROFILE_KEY)
}

export function setMyProfileId(id: string) {
  localStorage.setItem(MY_PROFILE_KEY, id)
}

/**
 * Loads all profiles. If Supabase is configured, fetches the shared list
 * from the cloud and merges it into the local cache (cloud wins on
 * conflicts by `updatedAt`). Falls back to localStorage only otherwise.
 */
export async function loadAllProfiles(): Promise<Profile[]> {
  const local = readLocal()

  if (!isSupabaseConfigured || !supabase) {
    return local
  }

  try {
    const { data, error } = await supabase.from(PROFILES_TABLE).select('id, data')
    if (error) throw error

    const remote: Profile[] = (data ?? []).map((row: { id: string; data: Profile }) => row.data)

    const merged = new Map<string, Profile>()
    for (const p of local) merged.set(p.id, p)
    for (const p of remote) {
      const existing = merged.get(p.id)
      if (!existing || p.updatedAt >= existing.updatedAt) merged.set(p.id, p)
    }
    const result = Array.from(merged.values())
    writeLocal(result)
    return result
  } catch (err) {
    console.warn('Nie udało się pobrać profili z Supabase, używam lokalnej kopii.', err)
    return local
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  const local = readLocal()
  const idx = local.findIndex((p) => p.id === profile.id)
  if (idx >= 0) local[idx] = profile
  else local.push(profile)
  writeLocal(local)

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from(PROFILES_TABLE)
        .upsert({ id: profile.id, data: profile, updated_at: new Date().toISOString() })
      if (error) throw error
    } catch (err) {
      console.warn('Nie udało się zsynchronizować profilu z Supabase.', err)
    }
  }
}

export async function deleteProfile(id: string): Promise<void> {
  const local = readLocal().filter((p) => p.id !== id)
  writeLocal(local)

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from(PROFILES_TABLE).delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      console.warn('Nie udało się usunąć profilu w Supabase.', err)
    }
  }
}

export { isSupabaseConfigured }
