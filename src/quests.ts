const QUESTS = [
  'Find three trees with red fall color.',
  'Catch a tree with compound leaves — made of lots of little leaflets.',
  'Find any kind of oak tree.',
  'Catch a tree with heart-shaped leaves.',
  "Find a tree with leaves shaped like a fan.",
  'Catch the biggest tree you can find on your block.',
  'Find a tree growing acorns, nuts, or seed pods.',
  'Catch a tree you have never caught before.',
  'Find a tree with peeling or shaggy bark.',
  'Catch three different trees in one walk.',
]

/** Rotates weekly from a fixed list — same quest for everyone in a given week. */
export function weeklyQuest(date: Date = new Date()): string {
  const weeksSinceEpoch = Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000))
  return QUESTS[weeksSinceEpoch % QUESTS.length]
}
