import type { Species } from '../data/species'
import type { Catch, Profile } from '../types'
import { computeBadges, mostRecentBadge, totalPoints } from '../badges'
import { levelProgress } from '../levels'
import { weeklyQuest } from '../quests'
import { resetAllData } from '../db'

export function Home({
  catalog,
  catches,
  activeProfileCatches,
  activeProfile,
  onCatch,
  onDex,
  onBadges,
  onProfiles,
  onExport,
  onImport,
}: {
  catalog: Species[]
  catches: Catch[]
  activeProfileCatches: Catch[]
  activeProfile: Profile | null
  onCatch: () => void
  onDex: () => void
  onBadges: () => void
  onProfiles: () => void
  onExport: () => void
  onImport: (file: File) => void
}) {
  async function handleReset() {
    if (!window.confirm('Delete all catches and profiles on this phone? This cannot be undone.')) return
    await resetAllData()
    window.location.reload()
  }

  const caughtCount = new Set(catches.filter((c) => c.speciesId).map((c) => c.speciesId)).size
  const dexPct = catalog.length > 0 ? Math.round((caughtCount / catalog.length) * 100) : 0
  const points = totalPoints(activeProfileCatches, catalog)
  const progress = levelProgress(points)
  const recentBadge = mostRecentBadge(computeBadges(activeProfileCatches, catalog))
  const queuedCount = catches.filter((c) => c.pendingIdentification).length

  return (
    <main>
      <div className="home-header">
        <button className="profile-chip" onClick={onProfiles}>
          {activeProfile ? `${activeProfile.avatar} ${activeProfile.name}` : 'Choose who'}
        </button>
      </div>

      <h1>TreeDex</h1>

      <section className="level-card">
        <div className="level-top">
          <span className="level-emoji">{progress.level.emoji}</span>
          <div>
            <div className="level-name">{progress.level.name}</div>
            <div className="level-points">{points} XP</div>
          </div>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress.progressPct}%` }} />
        </div>
        <div className="level-next">
          {progress.next
            ? `${progress.pointsToNext! - progress.pointsIntoLevel} XP to ${progress.next.name} ${progress.next.emoji}`
            : 'Max level reached!'}
        </div>
      </section>

      <section className="dex-stat-card">
        <div className="dex-stat-row">
          <span>
            {caughtCount} of {catalog.length} Chicago trees caught
          </span>
          <span className="dex-stat-pct">{dexPct}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill dex-fill" style={{ width: `${dexPct}%` }} />
        </div>
      </section>

      {recentBadge && (
        <button className="recent-badge" onClick={onBadges}>
          <span className="recent-badge-icon">🏅</span>
          <div>
            <div className="recent-badge-label">New badge earned!</div>
            <div className="recent-badge-name">{recentBadge.name}</div>
          </div>
        </button>
      )}

      {queuedCount > 0 && (
        <p className="offline-banner">
          📡 {queuedCount} {queuedCount === 1 ? 'tree is' : 'trees are'} waiting to be identified — they'll finish
          automatically once you're back online.
        </p>
      )}

      <p className="quest-banner">🌳 This week's quest: {weeklyQuest()}</p>

      <button className="catch-btn" onClick={onCatch}>
        Catch a tree
      </button>

      <button className="identify-btn" onClick={onDex}>
        Open dex
      </button>

      <button className="reset-btn" onClick={onBadges}>
        Badge shelf
      </button>

      <section className="backup-row">
        <button className="reset-btn" onClick={onExport}>
          Export backup
        </button>
        <label className="reset-btn import-label">
          Import backup
          <input
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onImport(f)
              e.target.value = ''
            }}
          />
        </label>
      </section>

      <button className="reset-btn danger" onClick={handleReset}>
        Reset all data
      </button>
    </main>
  )
}
