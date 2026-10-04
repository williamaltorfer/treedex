import type { Species } from '../data/species'
import type { Catch, Profile } from '../types'
import { computeBadges, mostRecentBadge, totalPoints } from '../badges'
import { levelProgress } from '../levels'
import { weeklyQuest } from '../quests'
import {
  AvatarIcon,
  BookIcon,
  CameraIcon,
  ChevronRightIcon,
  CompassIcon,
  GearIcon,
  LevelBadgeIcon,
  MedalIcon,
  SignalIcon,
} from '../components/icons'

export function Home({
  catalog,
  catches,
  activeProfileCatches,
  activeProfile,
  onCatch,
  onDex,
  onBadges,
  onProfiles,
  onSettings,
}: {
  catalog: Species[]
  catches: Catch[]
  activeProfileCatches: Catch[]
  activeProfile: Profile | null
  onCatch: () => void
  onDex: () => void
  onBadges: () => void
  onProfiles: () => void
  onSettings: () => void
}) {
  const caughtCount = new Set(catches.filter((c) => c.speciesId).map((c) => c.speciesId)).size
  const dexPct = catalog.length > 0 ? Math.round((caughtCount / catalog.length) * 100) : 0
  const points = totalPoints(activeProfileCatches, catalog)
  const progress = levelProgress(points)
  const badges = computeBadges(activeProfileCatches, catalog)
  const recentBadge = mostRecentBadge(badges)
  const earnedBadgeCount = badges.filter((b) => b.earned).length
  const queuedCount = catches.filter((c) => c.pendingIdentification).length

  return (
    <main>
      <div className="home-header">
        <button className="profile-chip" onClick={onProfiles}>
          {activeProfile ? (
            <>
              <AvatarIcon avatar={activeProfile.avatar} size={22} />
              {activeProfile.name}
            </>
          ) : (
            'Choose who'
          )}
        </button>
        <button className="settings-btn" onClick={onSettings} aria-label="Settings">
          <GearIcon />
        </button>
      </div>

      <h1>TreeDex</h1>

      <section className="level-card card-clip">
        <div className="level-top">
          <span className="level-emoji">
            <LevelBadgeIcon levelName={progress.level.name} />
          </span>
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
            ? `${progress.pointsToNext! - progress.pointsIntoLevel} XP to ${progress.next.name}`
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
          <span className="recent-badge-icon">
            <MedalIcon size={34} />
          </span>
          <div>
            <div className="recent-badge-label">New badge earned!</div>
            <div className="recent-badge-name">{recentBadge.name}</div>
          </div>
        </button>
      )}

      {queuedCount > 0 && (
        <p className="offline-banner">
          <SignalIcon />
          {queuedCount} {queuedCount === 1 ? 'tree is' : 'trees are'} waiting to be identified — they'll finish
          automatically once you're back online.
        </p>
      )}

      <p className="quest-banner">
        <CompassIcon />
        This week's quest: {weeklyQuest()}
      </p>

      <button className="catch-btn card-clip" onClick={onCatch}>
        <span className="catch-btn-icon">
          <CameraIcon />
        </span>
        <span className="catch-btn-text">
          <strong>Catch a Tree</strong>
          <span>Point, snap, and see what you find</span>
        </span>
      </button>

      <div className="menu-tiles">
        <button className="menu-tile" onClick={onDex}>
          <span className="menu-tile-icon dex-icon">
            <BookIcon />
          </span>
          <span className="menu-tile-text">
            <strong>Open TreeDex</strong>
            <span>
              {caughtCount} of {catalog.length} trees found
            </span>
          </span>
          <ChevronRightIcon className="menu-tile-arrow" />
        </button>

        <button className="menu-tile" onClick={onBadges}>
          <span className="menu-tile-icon badge-icon">
            <MedalIcon />
          </span>
          <span className="menu-tile-text">
            <strong>Badge Shelf</strong>
            <span>
              {earnedBadgeCount} of {badges.length} badges earned
            </span>
          </span>
          <ChevronRightIcon className="menu-tile-arrow" />
        </button>
      </div>
    </main>
  )
}
