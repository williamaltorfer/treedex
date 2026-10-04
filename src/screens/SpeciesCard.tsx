import { useEffect, useState } from 'react'
import type { Species } from '../data/species'
import type { Catch } from '../types'
import { LeafIcon } from '../components/LeafIcon'
import { ReadAloudButton } from '../components/ReadAloudButton'
import { TreeIllustration } from '../components/TreeIllustration'
import { treeForm } from '../treeForm'
import { foliageColor } from '../foliageColor'
import { LEVELS } from '../levels'
import { fetchSpeciesPhoto, type WikiPhoto } from '../wikipedia'
import { BackArrowIcon } from '../components/icons'

const GROWTH_STAGES = [0, 1, 2, 3, 4] as const

export function SpeciesCard({
  species,
  catches,
  onBack,
}: {
  species: Species
  catches: Catch[]
  onBack: () => void
}) {
  const [cardPhotoUrl, setCardPhotoUrl] = useState<string | null>(null)
  const [wikiPhoto, setWikiPhoto] = useState<WikiPhoto | null>(null)
  const myCatches = catches.filter((c) => c.speciesId === species.id).sort((a, b) => a.capturedAt - b.capturedAt)
  const firstCatch = myCatches[0]
  const caught = myCatches.length > 0
  const canopyColor = foliageColor(species.fallColor)

  useEffect(() => {
    if (!firstCatch) return
    const url = URL.createObjectURL(firstCatch.photo)
    setCardPhotoUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [firstCatch])

  useEffect(() => {
    let cancelled = false
    setWikiPhoto(null)
    void fetchSpeciesPhoto(species.scientificName).then((photo) => {
      if (!cancelled) setWikiPhoto(photo)
    })
    return () => {
      cancelled = true
    }
  }, [species.scientificName])

  if (!caught) {
    return (
      <main>
        <button className="back-btn" onClick={onBack}>
          <BackArrowIcon /> Back
        </button>

        <LeafIcon shape={species.leafShape} size={64} caught={false} />

        <h1>{species.commonName}</h1>
        <p className="locked-message">Not caught yet! Find and catch this tree to unlock its card.</p>
      </main>
    )
  }

  return (
    <main>
      <button className="back-btn" onClick={onBack}>
        <BackArrowIcon /> Back
      </button>

      {cardPhotoUrl ? (
        <img className="reveal-photo" src={cardPhotoUrl} alt={species.commonName} />
      ) : (
        <LeafIcon shape={species.leafShape} size={64} rarity={species.rarity} />
      )}

      <h1>
        {species.commonName} <ReadAloudButton text={`${species.commonName}. ${species.funFacts.join(' ')}`} />
      </h1>
      <p className="scientific-name">{species.scientificName}</p>
      <span className={`rarity-badge rarity-${species.rarity}`}>{species.rarity}</span>

      <section className="growth-section">
        <h2>The full tree</h2>
        {wikiPhoto && (
          <figure className="wiki-photo">
            <img src={wikiPhoto.url} alt={`${species.commonName} tree`} />
            <figcaption>
              Photo via{' '}
              <a href={wikiPhoto.pageUrl} target="_blank" rel="noreferrer">
                Wikipedia
              </a>
            </figcaption>
          </figure>
        )}
        <div className="tree-hero">
          <TreeIllustration stage={4} form={treeForm(species.id)} color={canopyColor} size={120} />
        </div>
        <div className="growth-strip">
          {GROWTH_STAGES.map((stage) => (
            <div key={stage} className="growth-stage">
              <TreeIllustration stage={stage} form={treeForm(species.id)} color={canopyColor} size={44} />
              <span>{LEVELS[stage].name}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Stats</h2>
        <ul className="stats-list">
          <li>Region: {species.region}</li>
          <li>Native: {species.native ? 'Yes' : 'No — planted'}</li>
          <li>Size: {species.size}</li>
          <li>Fall color: {species.fallColor}</li>
        </ul>
      </section>

      <section>
        <h2>Fun facts</h2>
        <ul>
          {species.funFacts.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Who lives here</h2>
        <p>{species.whoLivesHere}</p>
      </section>

      {species.lookalikes.length > 0 && (
        <section>
          <h2>Look-alikes</h2>
          <ul>
            {species.lookalikes.map((l) => (
              <li key={l.id}>{l.howToTell}</li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2>Winter clues</h2>
        <p>{species.winterClues}</p>
      </section>

      {species.troubleTree && (
        <section>
          <h2>Trouble tree</h2>
          <p>{species.troubleTree}</p>
        </section>
      )}

      <section>
        <h2>Caught {myCatches.length} time{myCatches.length === 1 ? '' : 's'}</h2>
        {myCatches.map((c) => (
          <p key={c.id} className="catch-entry">
            {new Date(c.capturedAt).toLocaleDateString()}
            {c.placeLabel ? ` · ${c.placeLabel}` : ''}
          </p>
        ))}
      </section>
    </main>
  )
}
