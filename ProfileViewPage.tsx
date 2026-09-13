import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ExerciseItem from '../components/ExerciseItem'
import SkillItem from '../components/SkillItem'
import AddExerciseModal from '../components/AddExerciseModal'
import EditProfileModal from '../components/EditProfileModal'
import { useProfiles } from '../hooks/useProfiles'
import { BASIC_CATALOG, SKILL_CATALOG } from '../data/catalog'
import { defaultMeasurementFor, makeEntryId } from '../data/defaults'
import type { CatalogItem, ExerciseEntry, Measurement, SkillEntry } from '../types'

const MAX_ACTIVE_SKILLS = 3
type Segment = 'basic' | 'skills'

export default function ProfileViewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profiles, loading, myProfileId, updateProfile, removeProfile } = useProfiles()

  const [segment, setSegment] = useState<Segment>('basic')
  const [showAddExercise, setShowAddExercise] = useState(false)
  const [showAddSkill, setShowAddSkill] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)

  const profile = useMemo(() => profiles.find((p) => p.id === id), [profiles, id])
  const isEditable = profile ? profile.id === myProfileId : false

  if (loading) return <div className="container">Ładowanie…</div>

  if (!profile) {
    return (
      <div className="container">
        <Link to="/" className="back-link">
          ← Wróć do listy profili
        </Link>
        <div className="empty-state">
          <div className="empty-state__icon">🤷</div>
          <p>Nie znaleziono profilu.</p>
        </div>
      </div>
    )
  }

  const updateExercises = (exercises: ExerciseEntry[]) => updateProfile(profile.id, { exercises })
  const updateSkills = (skills: SkillEntry[]) => updateProfile(profile.id, { skills })

  const handleAddExercise = (item: CatalogItem) => {
    const entry: ExerciseEntry = {
      id: makeEntryId(),
      key: item.key,
      name: item.name,
      icon: item.icon,
      measurement: defaultMeasurementFor(item.defaultMeasurement),
    }
    updateExercises([...profile.exercises, entry])
    setShowAddExercise(false)
  }

  const handleAddSkill = (item: CatalogItem) => {
    if (profile.skills.length >= MAX_ACTIVE_SKILLS) return
    const entry: SkillEntry = {
      id: makeEntryId(),
      key: item.key,
      name: item.name,
      icon: item.icon,
      measurement: defaultMeasurementFor(item.defaultMeasurement),
      variation: '',
    }
    updateSkills([...profile.skills, entry])
    setShowAddSkill(false)
  }

  const handleDeleteProfile = async () => {
    if (!confirm('Na pewno usunąć ten profil? Tej operacji nie można cofnąć.')) return
    await removeProfile(profile.id)
    navigate('/')
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">
        ← Wróć do listy profili
      </Link>

      <div className="profile-header">
        {profile.photo ? (
          <img className="profile-header__avatar" src={profile.photo} alt={profile.username} />
        ) : (
          <div className="profile-header__avatar">🙂</div>
        )}
        <div className="profile-header__info">
          <h1 className="profile-header__name">{profile.username}</h1>
          <p className="profile-header__status">{profile.status}</p>
        </div>
        {isEditable && (
          <div className="profile-header__actions">
            <button className="btn btn-sm" onClick={() => setShowEditProfile(true)}>
              Edytuj profil
            </button>
            <button className="btn btn-sm btn-danger" onClick={handleDeleteProfile}>
              Usuń
            </button>
          </div>
        )}
      </div>

      <div className="segmented">
        <button
          className={`segmented__btn ${segment === 'basic' ? 'active' : ''}`}
          onClick={() => setSegment('basic')}
        >
          Basic
        </button>
        <button
          className={`segmented__btn ${segment === 'skills' ? 'active' : ''}`}
          onClick={() => setSegment('skills')}
        >
          Skille
        </button>
      </div>

      {segment === 'basic' && (
        <section>
          <div className="section-heading">
            <span className="section-heading__title">Podstawowe ćwiczenia</span>
            {isEditable && (
              <button className="btn btn-icon" onClick={() => setShowAddExercise(true)} title="Dodaj ćwiczenie">
                +
              </button>
            )}
          </div>

          {profile.exercises.length === 0 ? (
            <p className="skill-limit-note">Brak ćwiczeń. {isEditable && 'Dodaj pierwsze przyciskiem „+”.'}</p>
          ) : (
            <div className="exercise-list">
              {profile.exercises.map((ex) => (
                <ExerciseItem
                  key={ex.id}
                  exercise={ex}
                  editable={isEditable}
                  onChangeMeasurement={(m: Measurement) =>
                    updateExercises(
                      profile.exercises.map((e) => (e.id === ex.id ? { ...e, measurement: m } : e)),
                    )
                  }
                  onRemove={() => updateExercises(profile.exercises.filter((e) => e.id !== ex.id))}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {segment === 'skills' && (
        <section>
          <div className="section-heading">
            <span className="section-heading__title">
              Aktywne skille ({profile.skills.length}/{MAX_ACTIVE_SKILLS})
            </span>
            {isEditable && (
              <button
                className="btn btn-icon"
                onClick={() => setShowAddSkill(true)}
                title="Dodaj skill"
                disabled={profile.skills.length >= MAX_ACTIVE_SKILLS}
              >
                +
              </button>
            )}
          </div>

          {profile.skills.length >= MAX_ACTIVE_SKILLS && isEditable && (
            <p className="skill-limit-note">
              Osiągnięto limit {MAX_ACTIVE_SKILLS} aktywnie trenowanych skilli. Usuń jeden, aby dodać kolejny.
            </p>
          )}

          {profile.skills.length === 0 ? (
            <p className="skill-limit-note">
              Brak aktywnych skilli. {isEditable && 'Dodaj do 3 skilli przyciskiem „+”.'}
            </p>
          ) : (
            <div className="skill-list">
              {profile.skills.map((sk) => (
                <SkillItem
                  key={sk.id}
                  skill={sk}
                  editable={isEditable}
                  onChangeMeasurement={(m: Measurement) =>
                    updateSkills(profile.skills.map((s) => (s.id === sk.id ? { ...s, measurement: m } : s)))
                  }
                  onChangeVariation={(variation: string) =>
                    updateSkills(profile.skills.map((s) => (s.id === sk.id ? { ...s, variation } : s)))
                  }
                  onRemove={() => updateSkills(profile.skills.filter((s) => s.id !== sk.id))}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {showAddExercise && (
        <AddExerciseModal
          title="Dodaj ćwiczenie"
          catalog={BASIC_CATALOG}
          existingKeys={profile.exercises.map((e) => e.key)}
          onPick={handleAddExercise}
          onClose={() => setShowAddExercise(false)}
        />
      )}

      {showAddSkill && (
        <AddExerciseModal
          title="Dodaj skill"
          catalog={SKILL_CATALOG}
          existingKeys={profile.skills.map((s) => s.key)}
          disabledMessage={
            profile.skills.length >= MAX_ACTIVE_SKILLS
              ? `Możesz trenować maksymalnie ${MAX_ACTIVE_SKILLS} skille naraz.`
              : undefined
          }
          onPick={handleAddSkill}
          onClose={() => setShowAddSkill(false)}
        />
      )}

      {showEditProfile && (
        <EditProfileModal
          title="Edytuj profil"
          initialUsername={profile.username}
          initialStatus={profile.status}
          initialPhoto={profile.photo}
          onClose={() => setShowEditProfile(false)}
          onSave={(data) => {
            updateProfile(profile.id, data)
            setShowEditProfile(false)
          }}
        />
      )}
    </div>
  )
}
