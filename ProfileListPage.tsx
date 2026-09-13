import { useState } from 'react'
import ProfileCard from '../components/ProfileCard'
import EditProfileModal from '../components/EditProfileModal'
import { useProfiles } from '../hooks/useProfiles'
import { createEmptyProfileDraft } from '../data/defaults'
import { isSupabaseConfigured } from '../storage/profileStore'
import { useNavigate } from 'react-router-dom'

export default function ProfileListPage() {
  const { profiles, loading, myProfileId, createProfile } = useProfiles()
  const [showCreate, setShowCreate] = useState(false)
  const navigate = useNavigate()

  const handleCreate = async (data: { username: string; status: string; photo: string }) => {
    const draft = createEmptyProfileDraft()
    const profile = await createProfile({ ...draft, ...data })
    setShowCreate(false)
    navigate(`/profile/${profile.id}`)
  }

  return (
    <div className="container">
      <div className="section-heading">
        <h1 style={{ margin: 0 }}>Profile</h1>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          + Nowy profil
        </button>
      </div>

      {!isSupabaseConfigured && (
        <p className="sync-banner">
          Dane są zapisywane <strong>tylko lokalnie</strong> w tej przeglądarce. Aby współdzielić
          profile między urządzeniami, skonfiguruj Supabase — zobacz README.
        </p>
      )}

      {loading ? (
        <p>Ładowanie…</p>
      ) : profiles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🏋️</div>
          <p>Nie masz jeszcze żadnego profilu. Stwórz swój pierwszy!</p>
        </div>
      ) : (
        <div className="profile-grid">
          {profiles.map((p) => (
            <ProfileCard key={p.id} profile={p} isMine={p.id === myProfileId} />
          ))}
        </div>
      )}

      {showCreate && (
        <EditProfileModal
          title="Stwórz profil"
          initialUsername=""
          initialStatus="Nowy w kalistenice 💪"
          initialPhoto=""
          onClose={() => setShowCreate(false)}
          onSave={handleCreate}
        />
      )}
    </div>
  )
}
