export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary'

export type LeafShape =
  | 'lobed-rounded'
  | 'lobed-pointed'
  | 'simple-toothed'
  | 'simple-heart'
  | 'compound-pinnate'
  | 'compound-palmate'
  | 'fan'
  | 'triangle-toothed'
  | 'needle'
  | 'narrow-lance'
  | 'unknown'

/** Mirrors the regional groupings from the neighborhood tree-walk list this catalog was checked against. */
export type Region =
  | 'Maples'
  | 'Mighty Oaks'
  | 'Riverbank Corridor'
  | 'Neighborhood Giants & Parkway Trees'
  | 'Yard & Parkway Ornamentals'

export interface Lookalike {
  id: string
  howToTell: string
}

export interface Species {
  id: string
  commonName: string
  scientificName: string
  genus: string
  family: string
  native: boolean
  rarity: Rarity
  region: Region
  leafType: string
  leafShape: LeafShape
  fallColor: string
  size: string
  funFacts: string[]
  whoLivesHere: string
  lookalikes: Lookalike[]
  winterClues: string
  troubleTree?: string
  sources: string[]
}
