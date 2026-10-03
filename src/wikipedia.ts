export interface WikiPhoto {
  url: string
  pageUrl: string
}

export interface WikiSummary {
  title: string
  extract: string
  photo: WikiPhoto | null
}

const summaryCache = new Map<string, WikiSummary | null>()

/**
 * Looks up a species via Wikipedia's public REST summary API (CORS-enabled,
 * no key, free). Queried by scientific name since that reliably redirects to
 * the right article even when the common name is ambiguous. Returns null on
 * any failure so callers can degrade gracefully (this is online-only like
 * Pl@ntNet).
 */
export async function fetchSpeciesSummary(scientificName: string): Promise<WikiSummary | null> {
  if (summaryCache.has(scientificName)) return summaryCache.get(scientificName)!

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(scientificName)}`,
    )
    if (!res.ok) {
      summaryCache.set(scientificName, null)
      return null
    }
    const data = await res.json()
    const source = data.originalimage?.source ?? data.thumbnail?.source
    const photo: WikiPhoto | null = source
      ? {
          url: source,
          pageUrl: data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
        }
      : null
    const summary: WikiSummary = { title: data.title ?? scientificName, extract: data.extract ?? '', photo }
    summaryCache.set(scientificName, summary)
    return summary
  } catch {
    summaryCache.set(scientificName, null)
    return null
  }
}

/** Convenience wrapper for callers that only need the photo (species card hero image). */
export async function fetchSpeciesPhoto(scientificName: string): Promise<WikiPhoto | null> {
  const summary = await fetchSpeciesSummary(scientificName)
  return summary?.photo ?? null
}
