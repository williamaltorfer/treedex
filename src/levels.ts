export interface Level {
  name: string
  emoji: string
  min: number
}

/**
 * Thresholds are calibrated against the catalog's current max possible
 * score (775 pts if every one of the 28 species were caught once) —
 * revisit if the catalog size or rarity mix changes a lot.
 */
export const LEVELS: Level[] = [
  { name: 'Seed', emoji: '🌰', min: 0 },
  { name: 'Sprout', emoji: '🌱', min: 40 },
  { name: 'Sapling', emoji: '🌿', min: 100 },
  { name: 'Young Tree', emoji: '🌳', min: 200 },
  { name: 'Mature Tree', emoji: '🌲', min: 350 },
  { name: 'Ancient Oak', emoji: '🏞️', min: 550 },
]

export interface LevelProgress {
  level: Level
  next: Level | null
  pointsIntoLevel: number
  pointsToNext: number | null
  progressPct: number
}

export function levelProgress(points: number): LevelProgress {
  let levelIndex = 0
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i].min) levelIndex = i
  }
  const level = LEVELS[levelIndex]
  const next = LEVELS[levelIndex + 1] ?? null

  const pointsIntoLevel = points - level.min
  const pointsToNext = next ? next.min - level.min : null
  const progressPct = next ? Math.min(100, Math.round((pointsIntoLevel / pointsToNext!) * 100)) : 100

  return { level, next, pointsIntoLevel, pointsToNext, progressPct }
}
