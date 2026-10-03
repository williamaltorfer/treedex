import { useState } from 'react'
import type { Organ, PlantNetResponse } from './plantnet'
import { identify } from './plantnet'
import './App.css'

const ORGANS: { value: Organ; label: string }[] = [
  { value: 'leaf', label: 'Leaf' },
  { value: 'bark', label: 'Bark' },
  { value: 'fruit', label: 'Seed or nut' },
  { value: 'flower', label: 'Flower' },
]

function App() {
  const [organ, setOrgan] = useState<Organ | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<PlantNetResponse | null>(null)

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResponse(null)
    setError(null)
  }

  async function handleIdentify() {
    if (!file || !organ) return
    setLoading(true)
    setError(null)
    try {
      const result = await identify([{ file, organ }])
      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setFile(null)
    setPreview(null)
    setResponse(null)
    setError(null)
  }

  return (
    <main>
      <h1>TreeDex — Phase 1</h1>
      <p className="subtitle">Accuracy spike: camera → Pl@ntNet → raw results.</p>

      <section>
        <h2>1. What are you photographing?</h2>
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
        <h2>2. Take the photo</h2>
        <label className="camera-btn">
          {preview ? 'Retake photo' : 'Open camera'}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhoto}
            hidden
          />
        </label>
        {preview && <img className="preview" src={preview} alt="Captured tree" />}
      </section>

      <section>
        <button
          className="identify-btn"
          disabled={!file || !organ || loading}
          onClick={handleIdentify}
        >
          {loading ? 'Identifying…' : 'Identify'}
        </button>
        {(file || response) && (
          <button className="reset-btn" onClick={reset}>
            Reset
          </button>
        )}
      </section>

      {error && <p className="error">{error}</p>}

      {response && (
        <section>
          <h2>Results</h2>
          <ol className="results">
            {response.results.slice(0, 5).map((r, i) => (
              <li key={i}>
                <strong>{r.species.scientificNameWithoutAuthor}</strong>{' '}
                <span className="score">{(r.score * 100).toFixed(1)}%</span>
                <div className="common-names">
                  {r.species.commonNames.join(', ')}
                </div>
              </li>
            ))}
          </ol>
          <details>
            <summary>Raw response</summary>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </details>
        </section>
      )}
    </main>
  )
}

export default App
