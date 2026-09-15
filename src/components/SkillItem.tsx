import type { Measurement, SkillEntry } from '../types'
import MeasurementEditor from './MeasurementEditor'

interface Props {
  skill: SkillEntry
  editable: boolean
  onChangeMeasurement?: (m: Measurement) => void
  onChangeVariation?: (variation: string) => void
  onEdit?: () => void
  onRemove?: () => void
}

export default function SkillItem({
  skill,
  editable,
  onChangeMeasurement,
  onChangeVariation,
  onEdit,
  onRemove,
}: Props) {
  return (
    <div className="skill-item">
      <div className="item-icon">{skill.icon}</div>
      <div className="item-main" style={{ flexBasis: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
          <div className="item-name">{skill.name}</div>
          <div className="item-controls">
            <MeasurementEditor
              measurement={skill.measurement}
              editable={editable}
              onChange={onChangeMeasurement}
            />
            {editable && onEdit && (
              <button className="icon-btn" onClick={onEdit} title="Edytuj nazwę/ikonę" aria-label="Edytuj nazwę/ikonę">
                ✎
              </button>
            )}
            {editable && onRemove && (
              <button className="icon-btn" onClick={onRemove} title="Usuń skill" aria-label="Usuń skill">
                ✕
              </button>
            )}
          </div>
        </div>

        {editable ? (
          <input
            className="variation-input"
            type="text"
            placeholder='Opisz aktualną wariację, np. "back lever straddle"'
            value={skill.variation}
            onChange={(e) => onChangeVariation?.(e.target.value)}
          />
        ) : (
          skill.variation && <div className="item-variation">Wariacja: {skill.variation}</div>
        )}
      </div>
    </div>
  )
}
