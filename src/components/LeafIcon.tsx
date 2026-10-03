import type { LeafShape, Rarity } from '../data/species'

const PATHS: Record<LeafShape, string> = {
  // Rounded lobes, like a bur or white oak leaf.
  'lobed-rounded':
    'M32 6c7 5 6 10 11 11-4 4-3 9 2 12-5 1-7 5-4 10-5 0-8 3-7 8-4-3-9-3-12 0 1-5-2-8-7-8 3-5 1-9-4-10 5-3 6-8 2-12 5-1 4-6 11-11 3-2 5-2 8 0z',
  // Sharp, pointed lobes, like a red oak or sycamore leaf.
  'lobed-pointed':
    'M32 6c3 6 9 8 13 14-5 1-7 4-5 9 5-1 8 2 8 7-5-2-9 0-10 5 4 2 5 6 3 10-4-3-8-2-10 2-2-4-6-5-10-2-2-4-1-8 3-10-1-5-5-7-10-5 0-5 3-8 8-7 2-5-1-8-5-9 4-6 10-8 13-14 1-2 4-2 5 0z',
  // Oval leaf with a gently toothed edge, like a Callery pear leaf.
  'simple-toothed':
    'M32 8c11 4 17 15 17 26 0 11-7 20-17 24-10-4-17-13-17-24 0-11 6-22 17-26z',
  // Heart-shaped leaf, like a redbud leaf.
  'simple-heart':
    'M32 56C16 44 7 33 7 23 7 13 15 7 23 7c4 0 7 2 9 6 2-4 5-6 9-6 8 0 16 6 16 16 0 10-9 21-25 33z',
  // Compound, feather-like leaf made of many small leaflets, like hickory or walnut.
  'compound-pinnate':
    'M32 4v56M32 12c-8-2-12 1-15 6 5 1 10 0 15-3M32 12c8-2 12 1 15 6-5 1-10 0-15-3M32 24c-9-2-13 1-16 7 5 1 10 0 16-4M32 24c9-2 13 1 16 7-5 1-10 0-16-4M32 36c-8-2-12 1-15 6 5 1 10 0 15-3M32 36c8-2 12 1 15 6-5 1-10 0-15-3M32 48c-6-1-9 1-11 4 4 1 7 0 11-2M32 48c6-1 9 1 11 4-4 1-7 0-11-2',
  // Compound leaf with leaflets fanning from one point, like a buckeye.
  'compound-palmate':
    'M32 50V24M32 24l-2-16c-3 1-5 3-6 6l8 10zM32 24l2-16c3 1 5 3 6 6l-8 10zM32 24l-12-9c-2 2-3 5-3 8l15 1zM32 24l12-9c2 2 3 5 3 8l-15 1z',
  // Fan-shaped leaf with a notch at the tip, like a ginkgo leaf.
  fan:
    'M32 54V30M11 18c0-8 9-15 21-15s21 7 21 15c0 11-9 14-21 26C20 32 11 29 11 18zM32 18v12',
  // Triangle-shaped leaf with a toothed edge, like a cottonwood leaf.
  'triangle-toothed':
    'M32 8 50 44c3 6-1 12-8 12H22c-7 0-11-6-8-12L32 8z',
  // Plain leaf silhouette, used before a species is caught.
  unknown:
    'M32 56C18 46 8 35 8 23 8 11 18 5 32 5s24 6 24 18c0 12-10 23-24 33z',
}

const RARITY_FILL: Record<Rarity, string> = {
  common: '#7e8870',
  uncommon: '#3d7dca',
  rare: '#9b59b6',
  legendary: '#d4a017',
}

export function LeafIcon({
  shape,
  size = 48,
  caught = true,
  rarity,
}: {
  shape: LeafShape
  size?: number
  caught?: boolean
  rarity?: Rarity
}) {
  const fill = !caught ? '#ccc' : rarity ? RARITY_FILL[rarity] : '#4a8a52'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={caught ? shape.replace(/-/g, ' ') : 'unidentified tree'}
    >
      <path
        d={caught ? PATHS[shape] : PATHS.unknown}
        fill={fill}
        fillOpacity={caught ? 0.18 : 0.5}
        stroke={fill}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
