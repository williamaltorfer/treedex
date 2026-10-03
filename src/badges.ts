import type { Species } from './data/species'
import type { Catch } from './types'

export interface Badge {
  id: string
  name: string
  description: string
  earned: boolean
  /** When this badge's condition first became true, from replaying catches in order. Null until earned. */
  earnedAt: number | null
}

function seasonOf(date: Date): 'spring' | 'summer' | 'fall' | 'winter' {
  const month = date.getMonth()
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'fall'
  return 'winter'
}

/** Badges are computed from one kid's catches — never stored, per the architecture doc. */
export function computeBadges(catches: Catch[], catalog: Species[]): Badge[] {
  const bySpeciesId = new Map(catalog.map((s) => [s.id, s]))
  const oakIds = new Set(catalog.filter((s) => s.genus === 'Quercus').map((s) => s.id))
  const allShapesCount = new Set(catalog.map((s) => s.leafShape)).size

  const sorted = catches
    .filter((c): c is Catch & { speciesId: string } => !!c.speciesId)
    .sort((a, b) => a.capturedAt - b.capturedAt)

  const caughtSpecies = new Set<string>()
  const caughtShapes = new Set<string>()
  const caughtOaks = new Set<string>()
  const seasonsBySpecies = new Map<string, Set<string>>()

  let firstCatchAt: number | null = null
  let oakHunterAt: number | null = null
  let fourSeasonsAt: number | null = null
  let leafShapesSetAt: number | null = null

  for (const c of sorted) {
    const species = bySpeciesId.get(c.speciesId)
    caughtSpecies.add(c.speciesId)
    if (firstCatchAt === null) firstCatchAt = c.capturedAt

    if (oakIds.has(c.speciesId)) caughtOaks.add(c.speciesId)
    if (oakHunterAt === null && caughtOaks.size >= 3) oakHunterAt = c.capturedAt

    if (species) caughtShapes.add(species.leafShape)
    if (leafShapesSetAt === null && allShapesCount > 0 && caughtShapes.size >= allShapesCount) {
      leafShapesSetAt = c.capturedAt
    }

    const seasons = seasonsBySpecies.get(c.speciesId) ?? new Set<string>()
    seasons.add(seasonOf(new Date(c.capturedAt)))
    seasonsBySpecies.set(c.speciesId, seasons)
    if (fourSeasonsAt === null && seasons.size >= 4) fourSeasonsAt = c.capturedAt
  }

  return [
    {
      id: 'first-catch',
      name: 'First Catch',
      description: 'Catch your first tree.',
      earned: firstCatchAt !== null,
      earnedAt: firstCatchAt,
    },
    {
      id: 'oak-hunter',
      name: 'Oak Hunter',
      description: 'Catch 3 different oak species.',
      earned: oakHunterAt !== null,
      earnedAt: oakHunterAt,
    },
    {
      id: 'four-seasons',
      name: 'Four Seasons',
      description: 'Catch the same tree in every season.',
      earned: fourSeasonsAt !== null,
      earnedAt: fourSeasonsAt,
    },
    {
      id: 'leaf-shapes-set',
      name: 'Leaf Shapes Set',
      description: 'Catch a tree with every leaf shape on the list.',
      earned: leafShapesSetAt !== null,
      earnedAt: leafShapesSetAt,
    },
  ]
}

export function mostRecentBadge(badges: Badge[]): Badge | null {
  const earned = badges.filter((b) => b.earned && b.earnedAt !== null)
  if (earned.length === 0) return null
  return earned.reduce((latest, b) => (b.earnedAt! > latest.earnedAt! ? b : latest))
}

const RARITY_POINTS: Record<Species['rarity'], number> = {
  common: 10,
  uncommon: 25,
  rare: 50,
  legendary: 100,
}

export function totalPoints(catches: Catch[], catalog: Species[]): number {
  const bySpecies = new Map(catalog.map((s) => [s.id, s]))
  const caughtSpeciesIds = new Set(catches.filter((c) => c.speciesId).map((c) => c.speciesId as string))
  let total = 0
  for (const id of caughtSpeciesIds) {
    const species = bySpecies.get(id)
    if (species) total += RARITY_POINTS[species.rarity]
  }
  return total
}
