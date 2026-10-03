import type { Species } from '../data/species'
import type { Organ, PlantNetResult } from '../plantnet'
import { LeafIcon } from '../components/LeafIcon'

const ORGAN_PROMPTS: Record<Organ, string> = {
  leaf: 'Which leaf looks like yours?',
  bark: 'Which bark looks like yours?',
  fruit: 'Which seed or nut looks like yours?',
  flower: 'Which flower looks like yours?',
}

export function CloseCall({
  candidates,
  photoUrl,
  organ,
  onPick,
  onNoneMatch,
}: {
  candidates: { species: Species; result: PlantNetResult }[]
  photoUrl: string
  organ: Organ
  onPick: (species: Species) => void
  onNoneMatch: () => void
}) {
  const showWinterClues = organ === 'bark' || organ === 'fruit'

  return (
    <main>
      <h1>{ORGAN_PROMPTS[organ]}</h1>
      <img className="preview" src={photoUrl} alt="Your tree" />

      <div className="candidate-grid">
        {candidates.map((c) => (
          <button key={c.species.id} className="candidate-card" onClick={() => onPick(c.species)}>
            <LeafIcon shape={c.species.leafShape} size={56} rarity={c.species.rarity} />
            <strong>{c.species.commonName}</strong>
            {showWinterClues && <span className="candidate-hint">{c.species.winterClues}</span>}
          </button>
        ))}
      </div>

      <button className="reset-btn" onClick={onNoneMatch}>
        None of these match
      </button>
    </main>
  )
}
