import { useRef, useState } from 'react'

interface Props {
  initialUsername: string
  initialStatus: string
  initialPhoto: string
  title: string
  onSave: (data: { username: string; status: string; photo: string }) => void
  onClose: () => void
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function EditProfileModal({
  initialUsername,
  initialStatus,
  initialPhoto,
  title,
  onSave,
  onClose,
}: Props) {
  const [username, setUsername] = useState(initialUsername)
  const [status, setStatus] = useState(initialStatus)
  const [photo, setPhoto] = useState(initialPhoto)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await fileToDataUrl(file)
    setPhoto(dataUrl)
  }

  const handleSubmit = () => {
    if (!username.trim()) return
    onSave({ username: username.trim(), status: status.trim(), photo })
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

        <div className="form-field">
          <label>Zdjęcie profilowe</label>
          <div className="avatar-picker">
            {photo ? (
              <img className="avatar-picker__preview" src={photo} alt="podgląd" />
            ) : (
              <div className="avatar-picker__preview">🙂</div>
            )}
            <button className="btn btn-sm" onClick={() => fileInputRef.current?.click()}>
              Wybierz plik
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFile}
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="username">Nazwa użytkownika</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="np. Kasia_Kalistenika"
          />
        </div>

        <div className="form-field">
          <label htmlFor="status">Status</label>
          <textarea
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Krótki opis, np. „Trenuję pod pierwszy front lever”"
          />
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Anuluj
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!username.trim()}>
            Zapisz
          </button>
        </div>
      </div>
    </div>
  )
}
