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
  | 'unknown'

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
