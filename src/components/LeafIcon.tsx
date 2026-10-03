import type { LeafShape } from '../data/species'

const PATHS: Record<LeafShape, string> = {
  // Rounded lobes, like a bur or white oak leaf.
  'lobed-rounded':
    'M32 4c-6 6-10 6-14 4 2 5 0 8-5 10 5 1 7 4 6 9-5-2-8 0-9 5 5-1 8 1 9 6-4 2-5 5-3 9 4-3 7-2 9 1 1-4 4-6 8-6 4 0 7 2 8 6 2-3 5-4 9-1 2-4 1-7-3-9 1-5 4-7 9-6-1-5-4-7-9-6 1-5-1-8-6-9 5-2 7-5 5-10-4 2-8 2-14-4z',
  // Sharp, pointed lobes, like a red oak or sycamore leaf.
  'lobed-pointed':
    'M32 4 24 16l-14-2 10 10-16 4 14 6-10 12 16-2-2 16 8-12 8 12-2-16 16 2-10-12 14-6-16-4 10-10-14 2z',
  // Simple oval leaf with a toothed edge, like a Callery pear leaf.
  'simple-toothed':
    'M32 6c10 4 16 14 16 26 0 12-7 22-16 26-9-4-16-14-16-26 0-12 6-22 16-26zm-14 8 2 3m2 4 2 3m2 4 2 3m2 4 2 3m2 4 2 3m2 4 2 2m4-33-2 3m-2 4-2 3m-2 4-2 3m-2 4-2 3m-2 4-2 3m-2 4-2 2',
  // Heart-shaped leaf, like a redbud leaf.
  'simple-heart':
    'M32 58C14 44 6 32 6 22 6 12 14 6 22 6c5 0 9 3 10 7 1-4 5-7 10-7 8 0 16 6 16 16 0 10-8 22-26 36z',
  // Compound, feather-like leaf made of many small leaflets, like hickory or walnut.
  'compound-pinnate':
    'M32 6v52M32 14l-14-5M32 14l14-5M32 24l-16-4M32 24l16-4M32 34l-17-3M32 34l17-3M32 44l-16-2M32 44l16-2M32 52l-12-1M32 52l12-1',
  // Compound leaf with leaflets fanning from one point, like a buckeye.
  'compound-palmate':
    'M32 40V18M32 18l-4-12-4 2 5 12M32 18l4-12 4 2-5 12M32 18l-10-6-3 3 10 7M32 18l10-6 3 3-10 7M20 44c-6 2-10 6-12 12M44 44c6 2 10 6 12 12M32 40c-4 4-6 10-6 16M32 40c4 4 6 10 6 16',
  // Fan-shaped leaf with a notch, like a ginkgo leaf.
  fan: 'M32 58V34M12 20c0-8 9-14 20-14s20 6 20 14c0 10-8 12-20 24-12-12-20-14-20-24zM32 20v14',
  // Triangle-shaped leaf with toothed edges, like a cottonwood leaf.
  'triangle-toothed':
    'M32 6 50 46c2 5-2 10-8 10H22c-6 0-10-5-8-10L32 6zm-12 32 2 3m3 3 2 3m4 2 2 2m4-2 2-3m3-3 2-3m-26-10 2 3m4-8 2 3',
  // Plain leaf silhouette, used before an organ/shape is known.
  unknown:
    'M32 58C18 48 8 36 8 24 8 12 18 6 32 6s24 6 24 18c0 12-10 24-24 34z',
}

export function LeafIcon({
  shape,
  size = 48,
  caught = true,
}: {
  shape: LeafShape
  size?: number
  caught?: boolean
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={caught ? shape.replace('-', ' ') : 'unidentified tree'}
    >
      <path
        d={caught ? PATHS[shape] : PATHS.unknown}
        fill={caught ? '#4a7c4e' : '#ccc'}
        stroke={caught ? '#2f6b3a' : '#999'}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
