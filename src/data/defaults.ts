import type { ExerciseEntry, Measurement, ProfileDraft } from '../types'
import { BASIC_CATALOG, DEFAULT_BASIC_KEYS, findCatalogItem } from './catalog'

function defaultMeasurementFor(type: Measurement['type']): Measurement {
  switch (type) {
    case 'time':
      return { type: 'time', value: 30 }
    case 'reps':
      return { type: 'reps', value: 10 }
    case 'repsSets':
      return { type: 'repsSets', value: 10, sets: 3 }
  }
}

let counter = 0
function makeEntryId() {
  counter += 1
  return `e_${Date.now()}_${counter}`
}

export function createDefaultExercises(): ExerciseEntry[] {
  return DEFAULT_BASIC_KEYS.map((key) => {
    const item = findCatalogItem(BASIC_CATALOG, key)!
    return {
      id: makeEntryId(),
      key: item.key,
      name: item.name,
      icon: item.icon,
      measurement: defaultMeasurementFor(item.defaultMeasurement),
    }
  })
}

export function createEmptyProfileDraft(): ProfileDraft {
  return {
    username: '',
    status: 'Nowy w kalistenice 💪',
    photo: '',
    exercises: createDefaultExercises(),
    skills: [],
  }
}

export { defaultMeasurementFor, makeEntryId }
