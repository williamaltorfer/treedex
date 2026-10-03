import type { Species } from '../data/species'
import type { PlantNetResult } from '../plantnet'
import { LeafIcon } from '../components/LeafIcon'

export function CloseCall({
  candidates,
  photoUrl,
  onPick,
  onNoneMatch,
}: {
  candidates: { species: Species; result: PlantNetResult }[]
  photoUrl: string
  onPick: (species: Species) => void
  onNoneMatch: () => void
}) {
  return (
    <main>
      <h1>Which leaf looks like yours?</h1>
      <img className="preview" src={photoUrl} alt="Your tree" />

      <div className="candidate-grid">
        {candidates.map((c) => (
          <button key={c.species.id} className="candidate-card" onClick={() => onPick(c.species)}>
            <LeafIcon shape={c.species.leafShape} size={56} />
            <strong>{c.species.commonName}</strong>
          </button>
        ))}
      </div>

      <button className="reset-btn" onClick={onNoneMatch}>
        None of these match
      </button>
    </main>
  )
}
