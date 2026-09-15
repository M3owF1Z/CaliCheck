import { useState } from 'react'

interface Props {
  title: string
  initialName: string
  initialIcon: string
  onSave: (data: { name: string; icon: string }) => void
  onClose: () => void
}

export default function EditEntryModal({ title, initialName, initialIcon, onSave, onClose }: Props) {
  const [name, setName] = useState(initialName)
  const [icon, setIcon] = useState(initialIcon)

  const handleSubmit = () => {
    if (!name.trim()) return
    onSave({ name: name.trim(), icon: icon.trim() || '⭐' })
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

        <div style={{ display: 'flex', gap: 10 }}>
          <div className="form-field" style={{ flex: '0 0 80px' }}>
            <label htmlFor="entry-icon">Ikonka</label>
            <input
              id="entry-icon"
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              maxLength={4}
              autoFocus
            />
          </div>
          <div className="form-field" style={{ flex: 1 }}>
            <label htmlFor="entry-name">Nazwa</label>
            <input id="entry-name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Anuluj
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!name.trim()}>
            Zapisz
          </button>
        </div>
      </div>
    </div>
  )
}
