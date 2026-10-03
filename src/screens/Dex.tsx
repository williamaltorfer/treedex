import type { Region, Species } from '../data/species'
import type { Catch } from '../types'
import { LeafIcon } from '../components/LeafIcon'

const REGION_ORDER: Region[] = [
  'Maples',
  'Mighty Oaks',
  'Riverbank Corridor',
  'Neighborhood Giants & Parkway Trees',
  'Yard & Parkway Ornamentals',
]

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

      {REGION_ORDER.map((region) => {
        const species = catalog.filter((s) => s.region === region)
        if (species.length === 0) return null
        return (
          <section key={region}>
            <h2>{region}</h2>
            <div className="dex-grid">
              {species.map((s) => {
                const caught = caughtIds.has(s.id)
                return (
                  <button key={s.id} className="dex-cell" onClick={() => onSelect(s)}>
                    <LeafIcon shape={s.leafShape} size={40} caught={caught} rarity={s.rarity} />
                    <span>{s.commonName}</span>
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}
    </main>
  )
}
