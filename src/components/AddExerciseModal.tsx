import type { CatalogItem } from '../types'

interface Props {
  title: string
  catalog: CatalogItem[]
  existingKeys: string[]
  disabledMessage?: string
  onPick: (item: CatalogItem) => void
  onClose: () => void
}

export default function AddExerciseModal({
  title,
  catalog,
  existingKeys,
  disabledMessage,
  onPick,
  onClose,
}: Props) {
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
