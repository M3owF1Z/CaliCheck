import type { Measurement, MeasurementType } from '../types'

interface Props {
  measurement: Measurement
  editable: boolean
  onChange?: (m: Measurement) => void
}

const TYPE_LABELS: Record<MeasurementType, string> = {
  time: 'Na czas',
  reps: 'Na powtórzenia',
  repsSets: 'Powt. w seriach',
}

function formatReadOnly(m: Measurement): string {
  switch (m.type) {
    case 'time':
      return `${m.value}s`
    case 'reps':
      return `max ${m.value} powt.`
    case 'repsSets':
      return `${m.value} powt. × ${m.sets ?? 1} serie`
  }
}

export default function MeasurementEditor({ measurement, editable, onChange }: Props) {
  if (!editable) {
    return <span className="measurement-badge">{formatReadOnly(measurement)}</span>
  }

  const handleTypeChange = (type: MeasurementType) => {
    if (!onChange) return
    if (type === 'repsSets') {
      onChange({ type, value: measurement.value || 10, sets: measurement.sets || 3 })
    } else {
      onChange({ type, value: measurement.value || (type === 'time' ? 30 : 10) })
    }
  }

  return (
    <div className="measurement-editor">
      <select
        value={measurement.type}
        onChange={(e) => handleTypeChange(e.target.value as MeasurementType)}
        aria-label="Typ pomiaru"
      >
        {Object.entries(TYPE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <input
        type="number"
        min={0}
        value={measurement.value}
        onChange={(e) => onChange?.({ ...measurement, value: Number(e.target.value) })}
        aria-label={measurement.type === 'time' ? 'Sekundy' : 'Powtórzenia'}
      />
      <span>{measurement.type === 'time' ? 's' : 'powt.'}</span>

      {measurement.type === 'repsSets' && (
        <>
          <span>×</span>
          <input
            type="number"
            min={1}
            value={measurement.sets ?? 1}
            onChange={(e) => onChange?.({ ...measurement, sets: Number(e.target.value) })}
            aria-label="Liczba serii"
          />
          <span>serie</span>
        </>
      )}
    </div>
  )
}
