import type { Species } from '../data/species'
import type { Catch } from '../types'
import { LeafIcon } from '../components/LeafIcon'

export function Dex({
  catalog,
  catches,
  onSelect,
  onBack,
}: {
  catalog: Species[]
  catches: Catch[]
  onSelect: (species: Species) => void
  onBack: () => void
}) {
  const caughtIds = new Set(catches.filter((c) => c.speciesId).map((c) => c.speciesId))

  return (
    <main>
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>
      <h1>Dex</h1>
      <div className="dex-grid">
        {catalog.map((s) => {
          const caught = caughtIds.has(s.id)
          return (
            <button key={s.id} className="dex-cell" onClick={() => onSelect(s)}>
              <LeafIcon shape={s.leafShape} size={40} caught={caught} rarity={s.rarity} />
              <span>{s.commonName}</span>
            </button>
          )
        })}
      </div>
    </main>
  )
}
