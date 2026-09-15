import type { ExerciseEntry, Measurement } from '../types'
import MeasurementEditor from './MeasurementEditor'

interface Props {
  exercise: ExerciseEntry
  editable: boolean
  onChangeMeasurement?: (m: Measurement) => void
  onEdit?: () => void
  onRemove?: () => void
}

export default function ExerciseItem({ exercise, editable, onChangeMeasurement, onEdit, onRemove }: Props) {
  return (
    <div className="exercise-item">
      <div className="item-icon">{exercise.icon}</div>
      <div className="item-main">
        <div className="item-name">{exercise.name}</div>
      </div>
      <div className="item-controls">
        <MeasurementEditor
          measurement={exercise.measurement}
          editable={editable}
          onChange={onChangeMeasurement}
        />
        {editable && onEdit && (
          <button className="icon-btn" onClick={onEdit} title="Edytuj nazwę/ikonę" aria-label="Edytuj nazwę/ikonę">
            ✎
          </button>
        )}
        {editable && onRemove && (
          <button className="icon-btn" onClick={onRemove} title="Usuń ćwiczenie" aria-label="Usuń ćwiczenie">
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
