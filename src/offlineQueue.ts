import * as db from './db'
import { identify } from './plantnet'
import { matchToCatalog } from './match'
import type { Species } from './data/species'

/**
 * Re-runs identify() on every catch that was queued while offline. A strong
 * match assigns the species directly (no kid in the loop to pick a
 * close-call candidate in the background), anything weaker is left as a
 * mystery tree with its candidates saved. Catches that still fail (e.g. the
 * connection drops mid-reconcile) stay queued for the next attempt.
 */
export async function reconcilePendingCatches(catalog: Species[]): Promise<number> {
  const all = await db.getAllCatches()
  const pending = all.filter((c) => c.pendingIdentification)
  let resolved = 0

  for (const c of pending) {
    try {
      const file = new File([c.photo], 'queued.jpg', { type: c.photo.type || 'image/jpeg' })
      const response = await identify([{ file, organ: c.organ }])
      const outcome = matchToCatalog(response, catalog)

      const speciesId = outcome.kind === 'strong' ? outcome.species.id : null
      const candidates =
        outcome.kind === 'close-call'
          ? outcome.candidates.map((cand) => cand.result)
          : outcome.kind === 'strong' || outcome.kind === 'genus-fallback'
            ? [outcome.result]
            : []

      await db.updateCatch({ ...c, speciesId, candidates, pendingIdentification: false })
      resolved++
    } catch {
      // Leave it queued — will retry on the next reconcile.
    }
  }

  return resolved
}
