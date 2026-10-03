export type Organ = 'leaf' | 'bark' | 'fruit' | 'flower'

export interface PlantNetSpecies {
  scientificNameWithoutAuthor: string
  genus: { scientificNameWithoutAuthor: string }
  family: { scientificNameWithoutAuthor: string }
  commonNames: string[]
}

export interface PlantNetResult {
  score: number
  species: PlantNetSpecies
}

export interface PlantNetResponse {
  results: PlantNetResult[]
}

const API_KEY = import.meta.env.VITE_PLANTNET_API_KEY as string | undefined

// Pl@ntNet's "all" flora project; swap for a regional one if Phase 1 finds
// it outperforms this for Illinois species.
const PROJECT = 'all'

export async function identify(photos: { file: File; organ: Organ }[]): Promise<PlantNetResponse> {
  if (!API_KEY) {
    throw new Error('Missing VITE_PLANTNET_API_KEY. Add it to .env.local.')
  }

  const form = new FormData()
  for (const { file, organ } of photos) {
    form.append('images', file)
    form.append('organs', organ)
  }

  const url = `https://my-api.plantnet.org/v2/identify/${PROJECT}?api-key=${API_KEY}`
  const res = await fetch(url, { method: 'POST', body: form })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Pl@ntNet ${res.status}: ${body}`)
  }

  return res.json()
}
