import type { Species } from '../data/species'
import type { Catch, Profile } from '../types'

export function Home({
  catalog,
  catches,
  activeProfile,
  onCatch,
  onDex,
  onProfiles,
  onExport,
  onImport,
}: {
  catalog: Species[]
  catches: Catch[]
  activeProfile: Profile | null
  onCatch: () => void
  onDex: () => void
  onProfiles: () => void
  onExport: () => void
  onImport: (file: File) => void
}) {
  const caughtCount = new Set(catches.filter((c) => c.speciesId).map((c) => c.speciesId)).size

  return (
    <main>
      <div className="home-header">
        <button className="profile-chip" onClick={onProfiles}>
          {activeProfile ? `${activeProfile.avatar} ${activeProfile.name}` : 'Choose who'}
        </button>
      </div>

      <h1>TreeDex</h1>
      <p className="dex-progress">
        {caughtCount} of {catalog.length} Chicago trees caught
      </p>

      <button className="catch-btn" onClick={onCatch}>
        Catch a tree
      </button>

      <button className="identify-btn" onClick={onDex}>
        Open dex
      </button>

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
    </main>
  )
}
