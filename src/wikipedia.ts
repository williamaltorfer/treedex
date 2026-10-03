export interface WikiPhoto {
  url: string
  pageUrl: string
}

const cache = new Map<string, WikiPhoto | null>()

/**
 * Looks up a real photo of the whole tree via Wikipedia's public REST summary
 * API (CORS-enabled, no key, free). Queried by scientific name since that
 * reliably redirects to the right article even when the common name is
 * ambiguous. Returns null on any failure so callers can degrade gracefully
 * (no real camera to test against, and this is online-only like Pl@ntNet).
 */
export async function fetchSpeciesPhoto(scientificName: string): Promise<WikiPhoto | null> {
  if (cache.has(scientificName)) return cache.get(scientificName)!

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(scientificName)}`,
    )
    if (!res.ok) {
      cache.set(scientificName, null)
      return null
    }
    const data = await res.json()
    const source = data.originalimage?.source ?? data.thumbnail?.source
    const photo: WikiPhoto | null = source
      ? { url: source, pageUrl: data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}` }
      : null
    cache.set(scientificName, photo)
    return photo
  } catch {
    cache.set(scientificName, null)
    return null
  }
}
