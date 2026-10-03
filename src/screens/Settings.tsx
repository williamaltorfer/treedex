import { resetAllData } from '../db'

export function Settings({
  onExport,
  onImport,
  onBack,
}: {
  onExport: () => void
  onImport: (file: File) => void
  onBack: () => void
}) {
  async function handleReset() {
    if (!window.confirm('Delete all catches and profiles on this phone? This cannot be undone.')) return
    await resetAllData()
    window.location.reload()
  }

  return (
    <main>
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>
      <h1>Settings</h1>

      <section className="backup-row">
        <button className="reset-btn" onClick={onExport}>
          Export backup
        </button>
        <label className="reset-btn import-label">
          Import backup
          <input
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onImport(f)
              e.target.value = ''
            }}
          />
        </label>
      </section>

      <button className="reset-btn danger" onClick={handleReset}>
        Reset all data
      </button>
    </main>
  )
}
