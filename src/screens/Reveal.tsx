import { useEffect, useState } from 'react'
import type { Species } from '../data/species'
import { ReadAloudButton } from '../components/ReadAloudButton'

export function Reveal({
  species,
  photoUrl,
  isFirstCatch,
  onDone,
}: {
  species: Species
  photoUrl: string
  isFirstCatch: boolean
  onDone: () => void
}) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setFlipped(true), 150)
    return () => clearTimeout(t)
  }, [])

  return (
    <main>
      <h1>{isFirstCatch ? 'Caught it! New tree!' : 'Caught again!'}</h1>

      <div className={flipped ? 'reveal-card flipped' : 'reveal-card'}>
        <div className={`reveal-card-inner rarity-${species.rarity}`}>
          <img className="reveal-photo" src={photoUrl} alt={species.commonName} />
          <div className="reveal-info">
            <span className={`rarity-badge rarity-${species.rarity}`}>{species.rarity}</span>
            <h2 className="reveal-name">{species.commonName}</h2>
            <p className="scientific-name">{species.scientificName}</p>
          </div>
        </div>
        <div className="reveal-stamp">CAUGHT!</div>
      </div>

      <p className="fun-fact">
        {species.funFacts[0]} <ReadAloudButton text={`${species.commonName}. ${species.funFacts[0]}`} />
      </p>

      <button className="identify-btn" onClick={onDone}>
        Nice!
      </button>
    </main>
  )
}
