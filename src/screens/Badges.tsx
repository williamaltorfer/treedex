import type { Badge } from '../badges'

export function Badges({ badges, onBack }: { badges: Badge[]; onBack: () => void }) {
  return (
    <main>
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>
      <h1>Badge shelf</h1>
      <div className="badge-grid">
        {badges.map((b) => (
          <div key={b.id} className={b.earned ? 'badge-card earned' : 'badge-card'}>
            <span className="badge-icon">{b.earned ? '🏅' : '🔒'}</span>
            <strong>{b.name}</strong>
            <span className="badge-description">{b.description}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
