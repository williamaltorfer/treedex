import { useEffect, useState } from 'react'
import speciesData from './data/species.json'
import type { Species } from './data/species'
import type { Catch, Profile } from './types'
import type { Organ, PlantNetResult } from './plantnet'
import type { MatchOutcome } from './match'
import { newId } from './id'

type Candidate = { species: Species; result: PlantNetResult }
import * as db from './db'
import { exportBackup, importBackup } from './backup'
import { Home } from './screens/Home'
import { CatchScreen } from './screens/CatchScreen'
import { CloseCall } from './screens/CloseCall'
import { Reveal } from './screens/Reveal'
import { Mystery } from './screens/Mystery'
import { Dex } from './screens/Dex'
import { SpeciesCard } from './screens/SpeciesCard'
import { Profiles } from './screens/Profiles'
import { Badges } from './screens/Badges'
import { computeBadges } from './badges'
import './App.css'

const catalog = speciesData as Species[]
const ACTIVE_PROFILE_KEY = 'treedex-active-profile'

type Screen =
  | { name: 'home' }
  | { name: 'catch' }
  | { name: 'close-call'; candidates: Candidate[]; photo: Blob; organ: Organ }
  | { name: 'reveal'; species: Species; photo: Blob; isFirstCatch: boolean }
  | { name: 'mystery'; photo: Blob; genus?: string }
  | { name: 'dex' }
  | { name: 'species'; species: Species }
  | { name: 'profiles' }
  | { name: 'badges' }

function App() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [activeProfileId, setActiveProfileId] = useState<string | null>(
    () => localStorage.getItem(ACTIVE_PROFILE_KEY) || null,
  )
  const [catches, setCatches] = useState<Catch[]>([])
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  useEffect(() => {
    void db.requestPersistentStorage()
    void refreshAll()
  }, [])

  useEffect(() => {
    if (activeProfileId) localStorage.setItem(ACTIVE_PROFILE_KEY, activeProfileId)
  }, [activeProfileId])

  async function refreshAll() {
    const [p, c] = await Promise.all([db.getAllProfiles(), db.getAllCatches()])
    setProfiles(p)
    setCatches(c)
  }

  function showPhoto(blob: Blob) {
    const url = URL.createObjectURL(blob)
    setPhotoUrl((old) => {
      if (old) URL.revokeObjectURL(old)
      return url
    })
  }

  async function saveCatch(speciesId: string | null, photo: Blob, organ: Organ, outcome: MatchOutcome) {
    const catcher = activeProfileId ?? 'unknown'
    const record: Catch = {
      id: newId(),
      capturedAt: Date.now(),
      speciesId,
      catcher,
      photo,
      organ,
      location: null,
      placeLabel: null,
      candidates:
        outcome.kind === 'close-call'
          ? outcome.candidates.map((c) => c.result)
          : outcome.kind === 'strong' || outcome.kind === 'genus-fallback'
            ? [outcome.result]
            : [],
      confirmedBy: 'app',
    }
    await db.addCatch(record)
    await refreshAll()
    return record
  }

  function handleOutcome(outcome: MatchOutcome, photo: Blob, organ: Organ) {
    showPhoto(photo)
    if (outcome.kind === 'strong') {
      const isFirstCatch = !catches.some((c) => c.speciesId === outcome.species.id)
      void saveCatch(outcome.species.id, photo, organ, outcome).then(() => {
        setScreen({ name: 'reveal', species: outcome.species, photo, isFirstCatch })
      })
    } else if (outcome.kind === 'close-call') {
      setScreen({ name: 'close-call', candidates: outcome.candidates, photo, organ })
    } else if (outcome.kind === 'genus-fallback') {
      void saveCatch(null, photo, organ, outcome).then(() => {
        setScreen({ name: 'mystery', photo, genus: outcome.genus })
      })
    } else {
      void saveCatch(null, photo, organ, outcome).then(() => {
        setScreen({ name: 'mystery', photo })
      })
    }
  }

  function handleQueueOffline(photo: Blob, organ: Organ) {
    showPhoto(photo)
    const record: Catch = {
      id: newId(),
      capturedAt: Date.now(),
      speciesId: null,
      catcher: activeProfileId ?? 'unknown',
      photo,
      organ,
      location: null,
      placeLabel: null,
      candidates: [],
      confirmedBy: 'app',
      pendingIdentification: true,
    }
    void db.addCatch(record).then(refreshAll)
    setScreen({ name: 'mystery', photo })
  }

  function handleCloseCallPick(species: Species, candidates: Candidate[], photo: Blob, organ: Organ) {
    const isFirstCatch = !catches.some((c) => c.speciesId === species.id)
    const record: Catch = {
      id: newId(),
      capturedAt: Date.now(),
      speciesId: species.id,
      catcher: activeProfileId ?? 'unknown',
      photo,
      organ,
      location: null,
      placeLabel: null,
      candidates: candidates.map((c) => c.result),
      confirmedBy: 'kid-pick',
    }
    void db.addCatch(record).then(refreshAll)
    setScreen({ name: 'reveal', species, photo, isFirstCatch })
  }

  const activeProfile = profiles.find((p) => p.id === activeProfileId) ?? null
  const needsProfileSetup = profiles.length === 0

  if (needsProfileSetup || screen.name === 'profiles') {
    return (
      <Profiles
        profiles={profiles}
        activeProfileId={activeProfileId}
        canClose={!needsProfileSetup}
        onAdd={(p) => void db.addProfile(p).then(() => {
          refreshAll()
          if (!activeProfileId) setActiveProfileId(p.id)
        })}
        onSwitch={(id) => {
          setActiveProfileId(id)
          setScreen({ name: 'home' })
        }}
        onDelete={(id) => void db.deleteProfile(id).then(refreshAll)}
        onDone={() => setScreen({ name: 'home' })}
      />
    )
  }

  switch (screen.name) {
    case 'catch':
      return (
        <CatchScreen
          catalog={catalog}
          onOutcome={handleOutcome}
          onQueueOffline={handleQueueOffline}
          onCancel={() => setScreen({ name: 'home' })}
        />
      )
    case 'close-call':
      return (
        <CloseCall
          candidates={screen.candidates}
          photoUrl={photoUrl!}
          onPick={(species) => handleCloseCallPick(species, screen.candidates, screen.photo, screen.organ)}
          onNoneMatch={() => {
            void saveCatch(null, screen.photo, screen.organ, { kind: 'mystery' }).then(() => {
              setScreen({ name: 'mystery', photo: screen.photo })
            })
          }}
        />
      )
    case 'reveal':
      return (
        <Reveal
          species={screen.species}
          photoUrl={photoUrl!}
          isFirstCatch={screen.isFirstCatch}
          onDone={() => setScreen({ name: 'dex' })}
        />
      )
    case 'mystery':
      return (
        <Mystery
          photoUrl={photoUrl!}
          title={screen.genus ? `Some kind of ${screen.genus}!` : undefined}
          message={
            screen.genus
              ? `We could tell the genus but not the exact species. Saved as a mystery tree for now.`
              : undefined
          }
          onDone={() => setScreen({ name: 'dex' })}
        />
      )
    case 'dex':
      return (
        <Dex
          catalog={catalog}
          catches={catches}
          onSelect={(species) => setScreen({ name: 'species', species })}
          onBack={() => setScreen({ name: 'home' })}
        />
      )
    case 'species':
      return <SpeciesCard species={screen.species} catches={catches} onBack={() => setScreen({ name: 'dex' })} />
    case 'badges':
      return (
        <Badges
          badges={computeBadges(catches.filter((c) => c.catcher === activeProfileId), catalog)}
          onBack={() => setScreen({ name: 'home' })}
        />
      )
    default:
      return (
        <Home
          catalog={catalog}
          catches={catches}
          activeProfileCatches={catches.filter((c) => c.catcher === activeProfileId)}
          activeProfile={activeProfile}
          onCatch={() => setScreen({ name: 'catch' })}
          onDex={() => setScreen({ name: 'dex' })}
          onBadges={() => setScreen({ name: 'badges' })}
          onProfiles={() => setScreen({ name: 'profiles' })}
          onExport={() => void exportBackup()}
          onImport={(file) => void importBackup(file).then(refreshAll)}
        />
      )
  }
}

export default App
