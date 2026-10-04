import type { Region, Species } from '../data/species'
import type { Catch, Profile } from '../types'
import { computeBadges, mostRecentBadge, totalPoints } from '../badges'
import { LEVELS, levelProgress } from '../levels'
import { weeklyQuest } from '../quests'
import { LeafIcon } from '../components/LeafIcon'
import {
  AvatarIcon,
  BookIcon,
  CameraIcon,
  ChevronRightIcon,
  CompassIcon,
  GearIcon,
  MedalIcon,
  SignalIcon,
} from '../components/icons'

/** Region shown in the Home screen's mini Dex preview — first region in the catalog's natural order. */
const PREVIEW_REGION: Region = 'Maples'
const PREVIEW_LIMIT = 8

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
  const caughtIds = new Set(catches.filter((c) => c.speciesId).map((c) => c.speciesId))
  const caughtCount = caughtIds.size
  const dexPct = catalog.length > 0 ? Math.round((caughtCount / catalog.length) * 100) : 0
  const points = totalPoints(activeProfileCatches, catalog)
  const progress = levelProgress(points)
  const levelNumber = LEVELS.findIndex((l) => l.name === progress.level.name) + 1
  const badges = computeBadges(activeProfileCatches, catalog)
  const recentBadge = mostRecentBadge(badges)
  const earnedBadgeCount = badges.filter((b) => b.earned).length
  const queuedCount = catches.filter((c) => c.pendingIdentification).length

  const previewSpecies = catalog.filter((s) => s.region === PREVIEW_REGION).slice(0, PREVIEW_LIMIT)

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
        <div className="level-top-row">
          <span className="level-eyebrow">Current Rank</span>
          <span className="level-eyebrow level-xp">{points} XP</span>
        </div>
        <h2 className="level-heading">
          Level <span className="level-num">{levelNumber}</span> · {progress.level.name}
        </h2>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress.progressPct}%` }} />
        </div>
        <div className="level-next">
          {progress.next
            ? `${progress.pointsToNext! - progress.pointsIntoLevel} XP to ${progress.next.name}`
            : 'Max level reached!'}
        </div>
      </section>

      <button className="journal-entry" onClick={onDex}>
        <div className="stamp-rail gold" />
        <div className="entry-body">
          <div className="entry-icon">
            <BookIcon size={24} />
          </div>
          <div className="entry-text">
            <p className="entry-title">Dex Progress</p>
            <p className="entry-sub">
              {caughtCount} of {catalog.length} Chicago trees caught
            </p>
            <div className="dex-mini-track">
              <div className="dex-mini-fill" style={{ width: `${dexPct}%` }} />
            </div>
          </div>
          <ChevronRightIcon className="entry-chevron" />
        </div>
      </button>

      <div className="journal-entry journal-entry-static">
        <div className="stamp-rail moss" />
        <div className="entry-body">
          <div className="entry-icon">
            <CompassIcon size={24} />
          </div>
          <div className="entry-text">
            <p className="entry-title">Today's Quest</p>
            <p className="entry-sub">{weeklyQuest()}</p>
          </div>
        </div>
      </div>

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

      <div className="tile-row">
        <button className="tile primary" onClick={onCatch}>
          <CameraIcon size={32} />
          <span className="tile-label">Catch</span>
        </button>
        <button className="tile" onClick={onDex}>
          <BookIcon size={32} />
          <span className="tile-label">Dex</span>
        </button>
        <button className="tile" onClick={onBadges}>
          <MedalIcon size={32} />
          <span className="tile-label">Badges</span>
        </button>
      </div>
      <p className="tile-row-caption">
        {earnedBadgeCount} of {badges.length} badges earned
      </p>

      {previewSpecies.length > 0 && (
        <button className="home-dex-preview-link" onClick={onDex}>
          <span className="section-label">
            <span className="dot" />
            {PREVIEW_REGION}
          </span>
          <div className="home-dex-grid">
            {previewSpecies.map((s) => (
              <span key={s.id} className="home-dex-cell">
                <LeafIcon shape={s.leafShape} size={26} caught={caughtIds.has(s.id)} rarity={s.rarity} />
              </span>
            ))}
          </div>
        </button>
      )}
    </main>
  )
}
