import { Link } from 'react-router-dom'
import type { Profile } from '../types'

interface Props {
  profile: Profile
  isMine: boolean
}

export default function ProfileCard({ profile, isMine }: Props) {
  return (
    <Link to={`/profile/${profile.id}`} className="profile-card">
      {profile.photo ? (
        <img className="profile-card__avatar" src={profile.photo} alt={profile.username} />
      ) : (
        <div className="profile-card__avatar">🙂</div>
      )}
      <div className="profile-card__name">{profile.username || 'Bez nazwy'}</div>
      {isMine && <span className="profile-card__badge">Ty</span>}
      <div className="profile-card__status">{profile.status}</div>
    </Link>
  )
}
