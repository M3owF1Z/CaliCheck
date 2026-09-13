export type MeasurementType = 'time' | 'reps' | 'repsSets'

export interface Measurement {
  type: MeasurementType
  /** seconds for 'time', rep count for 'reps', reps-per-set for 'repsSets' */
  value: number
  /** only used when type === 'repsSets' */
  sets?: number
}

export interface CatalogItem {
  /** stable key used to look up icon/name/default measurement */
  key: string
  name: string
  icon: string
  defaultMeasurement: MeasurementType
  /** short description of the movement family, shown in the add-modal */
  description?: string
}

export interface ExerciseEntry {
  id: string
  key: string
  name: string
  icon: string
  measurement: Measurement
}

export interface SkillEntry extends ExerciseEntry {
  /** free text describing the current variation, e.g. "muscle-up z gumą 10-15kg" */
  variation: string
}

export interface Profile {
  id: string
  username: string
  status: string
  /** data URL (base64) or a remote image URL */
  photo: string
  exercises: ExerciseEntry[]
  /** max 3 active skills */
  skills: SkillEntry[]
  createdAt: number
  updatedAt: number
}

export type ProfileDraft = Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>
