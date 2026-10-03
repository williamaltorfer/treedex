import { useEffect, useState } from 'react'
import type { Catch } from '../types'
import { ReadAloudButton } from '../components/ReadAloudButton'
import { fetchSpeciesSummary, type WikiSummary } from '../wikipedia'

export function WildFind({
  offCatalog,
  photo,
  onClose,
  mode,
}: {
  offCatalog: NonNullable<Catch['offCatalog']>
  photo: Blob
  onClose: () => void
  /** 'reveal' = just caught it, show a big "Nice!" CTA. 'view' = browsing from the dex later, show a back button. */
  mode: 'reveal' | 'view'
}) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [summary, setSummary] = useState<WikiSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = URL.createObjectURL(photo)
    setPhotoUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    void fetchSpeciesSummary(offCatalog.scientificName).then((s) => {
      if (!cancelled) {
        setSummary(s)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [offCatalog.scientificName])

  return (
    <main>
      {mode === 'view' && (
        <button className="back-btn" onClick={onClose}>
          ← Back
        </button>
      )}

      <span className="wild-find-badge">🌲 Wild find — not on the Chicago list</span>

      {photoUrl && <img className="reveal-photo" src={photoUrl} alt={offCatalog.commonName} />}

      <h1>
        {offCatalog.commonName}{' '}
        {summary?.extract && <ReadAloudButton text={`${offCatalog.commonName}. ${summary.extract}`} />}
      </h1>
      <p className="scientific-name">{offCatalog.scientificName}</p>

      {summary?.photo && (
        <figure className="wiki-photo">
          <img src={summary.photo.url} alt={`${offCatalog.commonName} tree`} />
          <figcaption>
            Photo via{' '}
            <a href={summary.photo.pageUrl} target="_blank" rel="noreferrer">
              Wikipedia
            </a>
          </figcaption>
        </figure>
      )}

      <section>
        <h2>Stats</h2>
        <ul className="stats-list">
          <li>Genus: {offCatalog.genus}</li>
          <li>Family: {offCatalog.family}</li>
        </ul>
      </section>

      <section>
        <h2>About this tree</h2>
        {loading && <p>Looking it up…</p>}
        {!loading && summary?.extract && <p>{summary.extract}</p>}
        {!loading && !summary?.extract && <p>We couldn't find more details about this one yet.</p>}
      </section>

      <p className="wild-find-note">
        This tree isn't one of the 28 on the Chicago list, so it won't fill in the dex — but it's still a real find!
      </p>

      {mode === 'reveal' && (
        <button className="identify-btn" onClick={onClose}>
          Nice!
        </button>
      )}
    </main>
  )
}
