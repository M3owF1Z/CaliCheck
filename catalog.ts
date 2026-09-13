import type { CatalogItem } from '../types'

/** The 5 exercises every new profile starts with. */
export const DEFAULT_BASIC_KEYS = ['pullup', 'dip', 'chinup', 'deadhang', 'row']

/** Full catalog of "Basic" calisthenics exercises (defaults + suggestions). */
export const BASIC_CATALOG: CatalogItem[] = [
  { key: 'pullup', name: 'Pull up', icon: '🧗', defaultMeasurement: 'reps', description: 'Podciąganie nachwytem' },
  { key: 'chinup', name: 'Chin up', icon: '🙌', defaultMeasurement: 'reps', description: 'Podciąganie podchwytem' },
  { key: 'dip', name: 'Dip', icon: '💪', defaultMeasurement: 'reps', description: 'Pompki na poręczach' },
  { key: 'deadhang', name: 'Dead hang', icon: '🦍', defaultMeasurement: 'time', description: 'Zwis na drążku' },
  { key: 'row', name: 'Row (wiosłowanie)', icon: '🚣', defaultMeasurement: 'repsSets', description: 'Wiosłowanie w podporze / na TRX' },
  { key: 'pushup', name: 'Push up', icon: '🤸', defaultMeasurement: 'repsSets', description: 'Klasyczne pompki' },
  { key: 'archer_pullup', name: 'Archer pull up', icon: '🏹', defaultMeasurement: 'reps', description: 'Podciąganie łucznicze (jednostronna progresja)' },
  { key: 'l_sit_pullup', name: 'L-sit pull up', icon: '📐', defaultMeasurement: 'reps', description: 'Podciąganie z nogami w L-sit' },
  { key: 'dynamic_pullup', name: 'Dynamic (clapping) pull up', icon: '👏', defaultMeasurement: 'reps', description: 'Wybuchowe podciąganie z klaśnięciem' },
  { key: 'weighted_pullup', name: 'Weighted pull up', icon: '🏋️', defaultMeasurement: 'reps', description: 'Podciąganie z dociążeniem' },
  { key: 'one_arm_pullup_progression', name: 'One-arm pull up (progresja)', icon: '☝️', defaultMeasurement: 'time', description: 'Negatywy / asysta do podciągania jednorącz' },
  { key: 'ring_dip', name: 'Ring dip', icon: '⭕', defaultMeasurement: 'reps', description: 'Dip na kółkach gimnastycznych' },
  { key: 'weighted_dip', name: 'Weighted dip', icon: '🏋️‍♂️', defaultMeasurement: 'reps', description: 'Dip z dociążeniem' },
  { key: 'pistol_squat', name: 'Pistol squat', icon: '🦵', defaultMeasurement: 'repsSets', description: 'Przysiad jednonóż' },
  { key: 'nordic_curl', name: 'Nordic curl', icon: '🦿', defaultMeasurement: 'reps', description: 'Uginanie nóg w podporze (biceps ud)' },
]

/** Full catalog of "Skille" (max 3 active at a time). */
export const SKILL_CATALOG: CatalogItem[] = [
  { key: 'muscle_up', name: 'Muscle up', icon: '🚀', defaultMeasurement: 'reps', description: 'Przejście z podciągnięcia w dip' },
  { key: 'l_sit', name: 'L-sit', icon: '📐', defaultMeasurement: 'time', description: 'Podpór z nogami uniesionymi na wprost' },
  { key: 'back_lever', name: 'Back lever', icon: '🌗', defaultMeasurement: 'time', description: 'Poziomy zwis tyłem do drążka' },
  { key: 'front_lever', name: 'Front lever', icon: '🌓', defaultMeasurement: 'time', description: 'Poziomy zwis przodem do drążka' },
  { key: 'planche', name: '90 degree hold (planche)', icon: '🛫', defaultMeasurement: 'time', description: 'Podpór poziomy na rękach' },
  { key: 'handstand', name: 'Handstand', icon: '🤾', defaultMeasurement: 'time', description: 'Stanie na rękach' },
  { key: 'dragon_flag', name: 'Dragon flag', icon: '🐉', defaultMeasurement: 'reps', description: 'Unoszenie całego ciała z podparciem na barkach' },
  { key: 'human_flag', name: 'Human flag', icon: '🚩', defaultMeasurement: 'time', description: 'Poziome utrzymanie ciała bokiem na maszcie' },
  { key: 'victorian', name: 'Victorian', icon: '🎩', defaultMeasurement: 'time', description: 'Zaawansowany wariant front lever (ręce za siebie)' },
  { key: 'maltese', name: 'Maltese', icon: '✝️', defaultMeasurement: 'time', description: 'Bardzo zaawansowany hold nisko nad ziemią na kółkach' },
]

export function findCatalogItem(list: CatalogItem[], key: string): CatalogItem | undefined {
  return list.find((c) => c.key === key)
}
