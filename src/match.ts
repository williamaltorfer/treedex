import type { PlantNetResponse, PlantNetResult } from './plantnet'
import type { Species } from './data/species'

/**
 * Thresholds are placeholders. The architecture doc calls for tuning these
 * against 20-30 real Phase 1 photos rather than guessing — revisit once
 * that test has been run.
 */
const STRONG_THRESHOLD = 0.3
const CLOSE_CALL_THRESHOLD = 0.05

export type MatchOutcome =
  | { kind: 'strong'; species: Species; result: PlantNetResult }
  | { kind: 'close-call'; candidates: { species: Species; result: PlantNetResult }[] }
  | { kind: 'genus-fallback'; genus: string; result: PlantNetResult }
  | { kind: 'mystery' }

export function matchToCatalog(response: PlantNetResponse, catalog: Species[]): MatchOutcome {
  const bySpeciesName = new Map(catalog.map((s) => [s.scientificName.toLowerCase(), s]))
  const byGenus = new Map(catalog.map((s) => [s.genus.toLowerCase(), s]))

  const inListResults = response.results
    .map((r) => ({ result: r, species: bySpeciesName.get(r.species.scientificNameWithoutAuthor.toLowerCase()) }))
    .filter((r): r is { result: PlantNetResult; species: Species } => !!r.species)

  const top = inListResults[0]
  if (top && top.result.score >= STRONG_THRESHOLD) {
    return { kind: 'strong', species: top.species, result: top.result }
  }

  const closeCall = inListResults.filter((r) => r.result.score >= CLOSE_CALL_THRESHOLD).slice(0, 3)
  if (closeCall.length > 0) {
    return { kind: 'close-call', candidates: closeCall }
  }

  const topResult = response.results[0]
  if (topResult) {
    const genus = topResult.species.genus.scientificNameWithoutAuthor
    if (byGenus.has(genus.toLowerCase()) && topResult.score >= CLOSE_CALL_THRESHOLD) {
      return { kind: 'genus-fallback', genus, result: topResult }
    }
  }

  return { kind: 'mystery' }
}
