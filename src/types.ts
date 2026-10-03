import type { Organ, PlantNetResult } from './plantnet'

export interface Profile {
  id: string
  name: string
  avatar: string
}

export interface Catch {
  id: string
  capturedAt: number
  speciesId: string | null
  catcher: string
  photo: Blob
  organ: Organ
  location: { lat: number; lon: number } | null
  placeLabel: string | null
  candidates: PlantNetResult[]
  confirmedBy: 'app' | 'kid-pick'
  /** True while a photo is waiting for a network connection to be identified. */
  pendingIdentification?: boolean
  /**
   * Set when Pl@ntNet confidently identified a real species that just isn't
   * one of the 28 curated Chicago trees. speciesId stays null — it's not
   * part of the collectible dex — but this carries enough to show a real
   * reveal (name, photo, facts) instead of a flat "mystery" dead end.
   */
  offCatalog?: {
    commonName: string
    scientificName: string
    genus: string
    family: string
  }
}
