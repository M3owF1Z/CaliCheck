import { useState } from 'react'
import type { CatalogItem, MeasurementType } from '../types'

interface CustomInput {
  name: string
  icon: string
  measurementType: MeasurementType
}

interface Props {
  title: string
  catalog: CatalogItem[]
  existingKeys: string[]
  disabledMessage?: string
  onPick: (item: CatalogItem) => void
  onAddCustom: (input: CustomInput) => void
  onClose: () => void
}

const MEASUREMENT_LABELS: Record<MeasurementType, string> = {
  time: 'Na czas',
  reps: 'Na powtórzenia',
  repsSets: 'Powt. w seriach',
}

export default function AddExerciseModal({
  title,
  catalog,
  existingKeys,
  disabledMessage,
  onPick,
  onAddCustom,
  onClose,
}: Props) {
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customIcon, setCustomIcon] = useState('⭐')
  const [customType, setCustomType] = useState<MeasurementType>('reps')

  const handleSubmitCustom = () => {
    if (!customName.trim()) return
    onAddCustom({ name: customName.trim(), icon: customIcon.trim() || '⭐', measurementType: customType })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Zamknij">
            ✕
          </button>
        </div>

        {disabledMessage && <p className="skill-limit-note">{disabledMessage}</p>}

        {!disabledMessage && (
          <div style={{ marginBottom: 16 }}>
            {!showCustomForm ? (
              <button className="btn btn-sm" onClick={() => setShowCustomForm(true)}>
                + Dodaj własne ćwiczenie
              </button>
            ) : (
              <div className="catalog-item" style={{ cursor: 'default', flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
                <div className="form-field" style={{ margin: 0 }}>
                  <label>Nazwa</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="np. Skater squat"
                    autoFocus
                  />
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <div className="form-field" style={{ margin: 0 }}>
                    <label>Ikonka (emoji)</label>
                    <input
                      type="text"
                      value={customIcon}
                      onChange={(e) => setCustomIcon(e.target.value)}
                      style={{ width: 60 }}
                      maxLength={4}
                    />
                  </div>
                  <div className="form-field" style={{ margin: 0 }}>
                    <label>Typ pomiaru</label>
                    <select value={customType} onChange={(e) => setCustomType(e.target.value as MeasurementType)}>
                      {Object.entries(MEASUREMENT_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowCustomForm(false)}>
                    Anuluj
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={handleSubmitCustom} disabled={!customName.trim()}>
                    Dodaj
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="catalog-list">
          {catalog.map((item) => {
            const alreadyAdded = existingKeys.includes(item.key)
            const disabled = alreadyAdded || Boolean(disabledMessage)
            return (
              <button
                key={item.key}
                className="catalog-item"
                disabled={disabled}
                onClick={() => !disabled && onPick(item)}
              >
                <div className="item-icon">{item.icon}</div>
                <div className="catalog-item__text">
                  <div className="catalog-item__name">
                    {item.name} {alreadyAdded && '(już dodano)'}
                  </div>
                  {item.description && <div className="catalog-item__desc">{item.description}</div>}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
