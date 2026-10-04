import { useEffect, useState } from 'react'
import type { Organ } from '../plantnet'
import { identify } from '../plantnet'
import { compressImage } from '../image'
import type { Species } from '../data/species'
import { matchToCatalog, type MatchOutcome } from '../match'
import { BackArrowIcon, SignalIcon, SnowflakeIcon } from '../components/icons'

const ORGANS: { value: Organ; label: string }[] = [
  { value: 'leaf', label: 'Leaf' },
  { value: 'bark', label: 'Bark' },
  { value: 'fruit', label: 'Seed or nut' },
  { value: 'flower', label: 'Flower' },
]

function isWinterMonth(date: Date = new Date()): boolean {
  const month = date.getMonth()
  return month === 11 || month === 0 || month === 1
}

export function CatchScreen({
  catalog,
  onOutcome,
  onQueueOffline,
  onCancel,
}: {
  catalog: Species[]
  onOutcome: (outcome: MatchOutcome, photo: Blob, organ: Organ) => void
  onQueueOffline: (photo: Blob, organ: Organ) => void
  onCancel: () => void
}) {
  const [organ, setOrgan] = useState<Organ | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setError(null)
  }

  async function handleIdentify() {
    if (!file || !organ) return
    setLoading(true)
    setError(null)
    try {
      const compressed = await compressImage(file)

      if (!navigator.onLine) {
        onQueueOffline(compressed, organ)
        return
      }

      const compressedFile = new File([compressed], file.name, { type: compressed.type })
      const response = await identify([{ file: compressedFile, organ }])
      const outcome = matchToCatalog(response, catalog)
      onOutcome(outcome, compressed, organ)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <button className="back-btn" onClick={onCancel}>
        <BackArrowIcon /> Back
      </button>

      {isWinterMonth() && (
        <p className="quest-banner">
          <SnowflakeIcon />
          No leaves around? Try Bark or Seed/nut instead — lots of trees can still be identified in winter.
        </p>
      )}

      <section>
        <h2>What are you photographing?</h2>
        <div className="organ-grid">
          {ORGANS.map((o) => (
            <button
              key={o.value}
              className={organ === o.value ? 'organ selected' : 'organ'}
              onClick={() => setOrgan(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2>Take the photo</h2>
        <label className="camera-btn">
          {preview ? 'Retake photo' : 'Open camera'}
          <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} hidden />
        </label>
        {import.meta.env.DEV && (
          <label className="camera-btn upload-btn">
            Upload photo instead (dev only)
            <input type="file" accept="image/*" onChange={handlePhoto} hidden />
          </label>
        )}
        {preview && <img className="preview" src={preview} alt="Captured tree" />}
      </section>

      {!isOnline && (
        <p className="offline-banner">
          <SignalIcon />
          No connection right now — your photo will be saved and identified automatically once you're back
          online.
        </p>
      )}

      <button className="identify-btn" disabled={!file || !organ || loading} onClick={handleIdentify}>
        {loading ? 'Identifying…' : !isOnline ? 'Save for later' : 'Identify'}
      </button>

      {error && <p className="error">{error}</p>}
    </main>
  )
}
