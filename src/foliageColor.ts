/** Maps a species' real fall-color description (already fact-checked in the catalog) to a representative hex, so the tree illustration's canopy isn't an arbitrary color. */
const KEYWORD_COLORS: [string, string][] = [
  ['crimson', '#b3283d'],
  ['scarlet', '#c0392b'],
  ['maroon', '#7a3b3b'],
  ['plum', '#7a3b4f'],
  ['burgundy', '#6e2c3a'],
  ['wine-red', '#7a3344'],
  ['russet', '#a8502e'],
  ['copper', '#a9682f'],
  ['bronze', '#8f6a2e'],
  ['red', '#c0392b'],
  ['orange', '#e07b39'],
  ['gold', '#d4a017'],
  ['purple', '#8e5ba6'],
  ['yellow', '#e3c547'],
  ['green', '#6b8f4e'],
  ['brown', '#9a7a4a'],
]

export function foliageColor(fallColor: string): string {
  const lower = fallColor.toLowerCase()
  for (const [keyword, hex] of KEYWORD_COLORS) {
    if (lower.includes(keyword)) return hex
  }
  return '#c9a227'
}
