import type { Badge } from '../badges'
import { BackArrowIcon, LockIcon, MedalIcon } from '../components/icons'

export function Badges({ badges, onBack }: { badges: Badge[]; onBack: () => void }) {
  return (
    <main>
      <button className="back-btn" onClick={onBack}>
        <BackArrowIcon /> Back
      </button>
      <h1>Badge shelf</h1>
      <div className="badge-grid">
        {badges.map((b) => (
          <div key={b.id} className={b.earned ? 'badge-card earned' : 'badge-card'}>
            <span className="badge-icon">{b.earned ? <MedalIcon size={34} /> : <LockIcon size={34} />}</span>
            <strong>{b.name}</strong>
            <span className="badge-description">{b.description}</span>
            {b.earned && b.earnedAt && (
              <span className="badge-date">{new Date(b.earnedAt).toLocaleDateString()}</span>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
