import type { Species } from './data/species'
import type { Catch } from './types'

export interface Badge {
  id: string
  name: string
  description: string
  earned: boolean
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
  const caughtSpeciesIds = new Set(catches.filter((c) => c.speciesId).map((c) => c.speciesId as string))

  const oakIds = catalog.filter((s) => s.genus === 'Quercus').map((s) => s.id)
  const oakCount = oakIds.filter((id) => caughtSpeciesIds.has(id)).length

  const allShapes = new Set(catalog.map((s) => s.leafShape))
  const caughtShapes = new Set(
    catalog.filter((s) => caughtSpeciesIds.has(s.id)).map((s) => s.leafShape),
  )

  const seasonsBySpecies = new Map<string, Set<string>>()
  for (const c of catches) {
    if (!c.speciesId) continue
    const seasons = seasonsBySpecies.get(c.speciesId) ?? new Set<string>()
    seasons.add(seasonOf(new Date(c.capturedAt)))
    seasonsBySpecies.set(c.speciesId, seasons)
  }
  const fourSeasons = [...seasonsBySpecies.values()].some((s) => s.size >= 4)

  return [
    {
      id: 'first-catch',
      name: 'First Catch',
      description: 'Catch your first tree.',
      earned: caughtSpeciesIds.size >= 1,
    },
    {
      id: 'oak-hunter',
      name: 'Oak Hunter',
      description: 'Catch 3 different oak species.',
      earned: oakCount >= 3,
    },
    {
      id: 'four-seasons',
      name: 'Four Seasons',
      description: 'Catch the same tree in every season.',
      earned: fourSeasons,
    },
    {
      id: 'leaf-shapes-set',
      name: 'Leaf Shapes Set',
      description: 'Catch a tree with every leaf shape on the list.',
      earned: allShapes.size > 0 && caughtShapes.size >= allShapes.size,
    },
  ]
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
