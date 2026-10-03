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
}
