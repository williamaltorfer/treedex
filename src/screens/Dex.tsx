import { useEffect, useState } from 'react'
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

function WildFindTile({ catchRecord, onSelect }: { catchRecord: Catch; onSelect: () => void }) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    const objectUrl = URL.createObjectURL(catchRecord.photo)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [catchRecord.photo])

  return (
    <button className="dex-cell" onClick={onSelect}>
      {url ? (
        <img className="wild-find-thumb" src={url} alt={catchRecord.offCatalog?.commonName} />
      ) : (
        <LeafIcon shape="unknown" size={40} caught={false} />
      )}
      <span>{catchRecord.offCatalog?.commonName}</span>
    </button>
  )
}

export function Dex({
  catalog,
  catches,
  onSelect,
  onSelectWildFind,
  onBack,
}: {
  catalog: Species[]
  catches: Catch[]
  onSelect: (species: Species) => void
  onSelectWildFind: (c: Catch) => void
  onBack: () => void
}) {
  const caughtIds = new Set(catches.filter((c) => c.speciesId).map((c) => c.speciesId))
  const wildFinds = catches.filter((c) => c.offCatalog)

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

      {wildFinds.length > 0 && (
        <section>
          <h2>🌲 Wild Finds</h2>
          <div className="dex-grid">
            {wildFinds.map((c) => (
              <WildFindTile key={c.id} catchRecord={c} onSelect={() => onSelectWildFind(c)} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
