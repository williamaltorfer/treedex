import { useState } from 'react'
import type { Profile } from '../types'

const AVATARS = ['🦉', '🦊', '🐿️', '🦌', '🐦', '🦝', '🐢', '🦔']

export function Profiles({
  profiles,
  activeProfileId,
  onAdd,
  onSwitch,
  onDelete,
  onDone,
  canClose,
}: {
  profiles: Profile[]
  activeProfileId: string | null
  onAdd: (p: Profile) => void
  onSwitch: (id: string) => void
  onDelete: (id: string) => void
  onDone: () => void
  canClose: boolean
}) {
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(AVATARS[0])

  function handleAdd() {
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd({ id: crypto.randomUUID(), name: trimmed, avatar })
    setName('')
  }

  return (
    <main>
      <h1>Who's catching trees?</h1>

      <section className="profile-list">
        {profiles.map((p) => (
          <div key={p.id} className={p.id === activeProfileId ? 'profile-row active' : 'profile-row'}>
            <button className="profile-btn" onClick={() => onSwitch(p.id)}>
              <span className="avatar">{p.avatar}</span>
              {p.name}
            </button>
            <button className="profile-delete" onClick={() => onDelete(p.id)} aria-label={`Remove ${p.name}`}>
              ×
            </button>
          </div>
        ))}
      </section>

      <section>
        <h2>Add a kid</h2>
        <div className="avatar-grid">
          {AVATARS.map((a) => (
            <button
              key={a}
              className={a === avatar ? 'avatar-choice selected' : 'avatar-choice'}
              onClick={() => setAvatar(a)}
            >
              {a}
            </button>
          ))}
        </div>
        <input
          className="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          maxLength={20}
        />
        <button className="identify-btn" onClick={handleAdd} disabled={!name.trim()}>
          Add
        </button>
      </section>

      {canClose && (
        <button className="reset-btn" onClick={onDone}>
          Done
        </button>
      )}
    </main>
  )
}
